declare namespace Project {
    interface Project {
        id?: number;
        name: string;
        all_rows?: number;
        read_rows?: number;
        version: string;
        entry: string;
        user_id?: number;
        base_dir: string;
        createdAt?: number;
        updatedAt?: number;
    }
}