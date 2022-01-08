import { api_endpoints } from "../constants/api-endpoints";

export class Resolvers {
    public resolveImageUrl(unresolved_item: any, img_props: string[]): any {
        let resolved_item: any = null;
        img_props.forEach(prop => {
            const curr_url: String = unresolved_item[prop]
            if (curr_url) {
                unresolved_item[prop] = api_endpoints.static_files_endpoint + curr_url
                resolved_item = unresolved_item;
            }
        });

        return resolved_item;
    }
}