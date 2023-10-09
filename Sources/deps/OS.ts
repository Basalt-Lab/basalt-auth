import { availableParallelism } from 'os';

export class OS {
    public static availableParallelism(): number {
        return availableParallelism();
    }
}
