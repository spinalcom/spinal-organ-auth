/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { serviceDocumentation } from 'spinal-env-viewer-plugin-documentation-service';
import { groupManagerService } from 'spinal-env-viewer-plugin-group-manager-service';

export default class SpinalAttributeService {
  constructor() {}

  getAllAttributes(nodeId, liste) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    if (realNode) {
      return serviceDocumentation.getCategory(realNode).then((res) => {
        return res
          .map((el) => {
            let attrs = el.element.get();
            return attrs.map((attr) => {
              if (liste && liste.indexOf(attr.label) === -1)
                liste.push(attr.label);
              attr['category'] = el.nameCat;
              return attr;
            });
          })
          .flat();
      });
    } else {
      return Promise.resolve([]);
    }
  }

  async getAllData(contextId, nodeId) {
    let context = SpinalGraphService.getRealNode(contextId);
    let realNode = SpinalGraphService.getRealNode(nodeId);
    let res = {
      types: [],
      attributes: [],
      data: {},
    };

    if (context && realNode) {
      // @ts-ignore
      await realNode.findInContext(context, async (node) => {
        // @ts-ignore
        SpinalGraphService._addNode(node);
        let type = node.getType().get();
        let info = node.info.get();

        if (res.types.indexOf(type) === -1) {
          res.types.push(type);
        }

        if (typeof res.data[type] === 'undefined') res.data[type] = [];

        info['attributes'] = await this.getAllAttributes(
          info.id,
          res.attributes
        );

        res.data[type].push(info);
      });
    }

    return res;
  }

  async createAttribute(nodeId, categoryName, attributeName, attributeValue) {
    let realNode = SpinalGraphService.getRealNode(nodeId);

    let category;

    category = await serviceDocumentation.getCategoryByName(
      realNode,
      categoryName
    );

    if (typeof category === 'undefined') {
      category = await serviceDocumentation.addCategoryAttribute(
        realNode,
        categoryName
      );
    }

    let attr = {
      label: attributeName,
      value: attributeValue,
    };

    await serviceDocumentation.addAttributeByCategory(
      realNode,
      category,
      attr.label,
      attr.value
    );
  }

  async updateAttributeValue(
    nodeId,
    categoryName,
    attributeName,
    attributeValue
  ) {
    let attr = await this.getOrCreateAttribute(
      nodeId,
      categoryName,
      attributeName
    );

    if (attr && attr.value) {
      attr.value.set(attributeValue);
    }
  }

  async removeAttributesByLabel(category, label) {
    await serviceDocumentation.removeAttributesByLabel(category, label);
  }

  async getOrCreateAttribute(nodeId, categoryName, attributeName) {
    let realNode = SpinalGraphService.getRealNode(nodeId);
    if (realNode) {
      let category = await serviceDocumentation.getCategoryByName(
        realNode,
        categoryName
      );

      if (typeof category === 'undefined') {
        category = await serviceDocumentation.addCategoryAttribute(
          realNode,
          categoryName
        );
      }
      await serviceDocumentation.addAttributeByCategory(
        realNode,
        category,
        attributeName,
        '-'
      );

      let attributes = await serviceDocumentation.getAttributesByCategory(
        realNode,
        categoryName
      );

      let attr = attributes.find((el) => {
        return el.label.get() === attributeName;
      });

      return attr;
    }
  }

  getAllGroupContext(type) {
    return groupManagerService.getGroupContexts(type).then((contexts) => {
      const promises = contexts.map(async (context) => {
        context['category'] = await this.getCategory(context.id);
        return context;
      });

      return Promise.all(promises);
    });
  }

  async getCategory(contextId) {
    const categories = await groupManagerService.getCategories(contextId);

    const promises = categories.map(async (category) => {
      let info = category.get();
      info['groups'] = await this.getGroup(category.id);
      return info;
    });

    return Promise.all(promises);
  }

  async getGroup(categoryId) {
    const groups = await groupManagerService.getGroups(categoryId);

    return groups.map((el) => el.get());
  }

  linkItem(contextId, parentId, itemId) {
    // groupService.linkElementToGroup(parentId, itemId, contextId)
    return groupManagerService.linkElementToGroup(contextId, parentId, itemId);
  }
}
