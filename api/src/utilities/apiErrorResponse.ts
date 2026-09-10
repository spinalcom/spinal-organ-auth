import { Controller } from "tsoa";
import { HttpStatusCode } from "./http-status-code";
import { AuthError } from "../security/AuthError";
import { OperationError } from "./operation-error";

interface ErrorShape {
	message?: string;
	status?: number;
	code?: number | string;
	details?: unknown;
	fields?: unknown;
}

export interface ApiErrorResponse {
	success: false;
	error: string;
	errorCode: string;
	status: number;
	timestamp: string;
	details?: unknown;
}

function getErrorShape(error: unknown): ErrorShape {
	if (typeof error === "object" && error !== null) {
		return error as ErrorShape;
	}

	return {};
}

function normalizeMessage(error: unknown): string {
	if (error instanceof Error && typeof error.message === "string" && error.message.trim().length > 0) {
		return error.message;
	}

	if (typeof error === "string" && error.trim().length > 0) {
		return error;
	}

	return "Internal Server Error";
}

function isHttpStatus(value: unknown): value is number {
	return typeof value === "number" && Number.isInteger(value) && value >= 100 && value <= 599;
}

export function getErrorStatus(error: unknown, fallbackStatus = HttpStatusCode.INTERNAL_SERVER_ERROR): number {
	if (error instanceof OperationError) {
		return error.status;
	}

	if (error instanceof AuthError && isHttpStatus(error.code)) {
		return error.code;
	}

	const shape = getErrorShape(error);
	if (isHttpStatus(shape.status)) {
		return shape.status;
	}

	if (isHttpStatus(shape.code)) {
		return shape.code;
	}

	return fallbackStatus;
}

function normalizeCodeFromMessage(message: string): string {
	return (
		message
			.trim()
			.toUpperCase()
			.replace(/[^A-Z0-9]+/g, "_")
			.replace(/^_+|_+$/g, "") || "INTERNAL_SERVER_ERROR"
	);
}

function getFallbackErrorCode(status: number): string {
	switch (status) {
		case HttpStatusCode.BAD_REQUEST:
			return "BAD_REQUEST";
		case HttpStatusCode.UNAUTHORIZED:
			return "UNAUTHORIZED";
		case HttpStatusCode.FORBIDDEN:
			return "FORBIDDEN";
		case HttpStatusCode.NOT_FOUND:
			return "NOT_FOUND";
		default:
			return "INTERNAL_SERVER_ERROR";
	}
}

function getErrorCode(error: unknown, status: number): string {
	if (error instanceof OperationError) {
		return normalizeCodeFromMessage(error.message);
	}

	if (error instanceof AuthError) {
		return "AUTH_ERROR";
	}

	const shape = getErrorShape(error);
	if (typeof shape.code === "string" && shape.code.trim().length > 0) {
		return normalizeCodeFromMessage(shape.code);
	}

	if (error instanceof Error && error.message) {
		return normalizeCodeFromMessage(error.message);
	}

	return getFallbackErrorCode(status);
}

function getDetails(error: unknown): unknown {
	const shape = getErrorShape(error);
	if (shape.fields) {
		return shape.fields;
	}

	return shape.details;
}

export function buildApiErrorResponse(error: unknown, status: number): ApiErrorResponse {
	const details = getDetails(error);
	const response: ApiErrorResponse = {
		success: false,
		error: normalizeMessage(error),
		errorCode: getErrorCode(error, status),
		status,
		timestamp: new Date().toISOString(),
	};

	if (details !== undefined) {
		response.details = details;
	}

	return response;
}

export function handleControllerError(controller: Controller, error: unknown): ApiErrorResponse {
	const status = getErrorStatus(error);
	controller.setStatus(status);
	return buildApiErrorResponse(error, status);
}
