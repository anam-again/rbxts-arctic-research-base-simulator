export class Queue<T extends defined> {
    private storage: T[] = [];

    constructor(private capacity: number = math.huge) { }

    enqueue(item: T): void {
        if (this.size() === this.capacity) {
            throw error("Queue has reached max capacity, you cannot add more items");
        }
        this.storage.push(item);
    }
    dequeue(): T | undefined {
        return this.storage.shift();
    }
    size(): number {
        return this.storage.size();
    }
}