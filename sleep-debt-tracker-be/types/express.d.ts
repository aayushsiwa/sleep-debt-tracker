export {}; // Ensure this file is treated as a module

declare global {
    namespace Express {
        interface Request {
            userId: string; // You can adjust this type depending on how you handle user IDs
            username: string; // Assuming you want to keep username as well
            password: string; // Assuming you want to keep password as well
        }
    }
}
