export interface PageItem {
    id: String,
    pageTitle: String,
    slug: String,
    category: String,
    linkTitle: String,
    content: String,
    isPublished: Boolean
}

export interface Pages {
    navLink?: PageItem[];
    support?: PageItem[];
    faq?: PageItem[];
    about?: PageItem[];
}