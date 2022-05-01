"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolvers = void 0;
const api_endpoints_1 = require("../constants/api-endpoints");
class Resolvers {
    resolveImageUrl(unresolved_item, img_props) {
        let resolved_item = null;
        img_props.forEach(prop => {
            const curr_url = unresolved_item[prop];
            if (curr_url) {
                unresolved_item[prop] = api_endpoints_1.api_endpoints.static_files_endpoint + curr_url;
                resolved_item = unresolved_item;
            }
        });
        return resolved_item;
    }
}
exports.Resolvers = Resolvers;
