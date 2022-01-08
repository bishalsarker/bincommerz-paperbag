export interface Category {
    id: String;
    name: String;
    slug: String;
    tagHashId: String;
    tagName: String;
    imageUrl: String;
    description: String;
    order: Number;
    subcategories: Category[];
}