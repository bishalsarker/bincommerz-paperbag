export interface Product {
    id: String;
    name: String
    description: String;
    imageUrl: String;
    images: ProductImageGalleryItem[];
    price: Number;
    discount: Number;
    oldPrice: Number;
    inStock: Boolean;
    stockQuantity: Number;
    tags: String[];
}

export interface ProductImageGalleryItem {
    id: String;
    originalImage: String;
    thumbnailImage: String;
    isDefault: Boolean;
}