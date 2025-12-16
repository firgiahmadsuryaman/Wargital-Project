export interface Restaurant {
    id: string;
    name: string;
    description: string;
    distance?: string;
    image?: string;
    imageHint?: string;
    menu?: MenuItem[];
    createdAt: string;
    updatedAt: string;
}

