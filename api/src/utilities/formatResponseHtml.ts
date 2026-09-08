

export function formatResponseHtml(urlCallback: string, data: { [key: string]: any }) {


    return `
        <html>
            <body>
                <form id="redirectForm" method="post" action='${urlCallback}'>
                    <input type="hidden" name="data" value='${JSON.stringify(data)}' />
                </form>

                <script>
                    document.getElementById('redirectForm').submit();
                </script>
            </body>
        </html>
    `


    // let start = `<form id="myForm" method="post" action="${urlCallback}">`
    // let end = "</form>" + '<script>document.getElementById("myForm").submit()</script>';


    // // let value = JSON.stringify(data);
    // // let content = `<input type="hidden" name="data" value="${value}"`;

    // let content = "";
    // for (const key in data) {
    //     let value = data[key];
    //     if (typeof value === "object") value = JSON.stringify(value);
    //     content += `<input type="hidden" name="${key}" value="${value}" />`;
    // }


    // return start + content + end;

}