export interface CreateTemplateDTO {
    name: string;
    description?: string;
}

export interface UpdateTemplateDTO {
    name?: string;
    description?: string;
    is_active?: boolean;
}