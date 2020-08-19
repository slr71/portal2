const axios = require('axios');
const yaml = require('js-yaml');
const fs = require('fs');

class ArgoApi {
    constructor(params) {
        this.disabled = params && 'disabled' in params && params.disabled;

        this.axios = axios.create({
          baseURL: params ? params.baseUrl : 'http://localhost:2746/api/v1',
          timeout: 1000,
          headers: { 'content-type': 'application/json' }
        });
    }

    async submit(yamlPath, entryPoint, parameters) {
        let doc;
        try {
            doc = yaml.safeLoad(fs.readFileSync(yamlPath, 'utf8'));
        }
        catch (e) {
            console.log(e);
            return;
        }

        const params = Object.keys(parameters).map(key => { return { name: key, value: parameters[key] } });

        doc["spec"]["entrypoint"] = entryPoint;
        doc["spec"]["arguments"] = { "parameters": params };

        const body = {
            "namespace": "default",
            "workflow": doc
        };
        console.log("body:", JSON.stringify(body, null, 4));

        if (this.disabled)
            return;

        try {
            const res = await this.axios.post('/workflows/default', body);
            //console.log("res:", res.data);
            return res.data;
        }
        catch (e) {
            console.log(e);
            return;
        }

        // const body = {
        //   "namespace": "default",
        //   "resourceKind": "Workflow",
        //   "resourceName": "hello-world-9pq62",
        //   // "submitOptions": {
        //   //     "serverDryRun": false,
        //   //     "parameters": [ "user_id=374" ]
        //   // }
        // };

        // curl $ARGO_SERVER/api/v1/workflows/argo/submit \
        // -fs \
        // -H "Authorization: $ARGO_TOKEN" \
        // -d '{"resourceKind": "WorkflowTemplate", "resourceName": "hello-argo", "submitOptions": {"labels": "workflows.argoproj.io/workflow-template=hello-argo"}}' 
    }
}

module.exports = new ArgoApi();