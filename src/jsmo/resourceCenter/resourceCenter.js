import '../libs/jquery.js'

let scriptFile = [];

function pullScript(scriptURL) {
    return new Promise((resolve, reject) => {
        scriptFile.push(scriptURL);
        $(function () {
            $.ajax({
                type: "GET",
                url: scriptURL,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    reject(error)
                }
            });
        });
    })

}

pullScript('data/HAKONIWA/script/start.txt').then(code => console.log(code))
