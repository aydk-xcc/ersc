declare namespace Project {
    interface Project {
        id?: number;
        name: string;
        process: number;
        entry: string;
        user_id: number;
        base_dir: string;
        createdAt: number;
        updatedAt: number;
    }
}