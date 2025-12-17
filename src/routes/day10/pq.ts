type Comparator<T> = (a: T, b: T) => number;

export class PriorityQueue<T> {
    private heap: T[] = [];

    constructor(private comparator: Comparator<T>) { }

    size(): number {
        return this.heap.length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    peek(): T | undefined {
        return this.heap[0];
    }

    enqueue(value: T): void {
        this.heap.push(value);
        this.bubbleUp(this.size() - 1);
    }

    dequeue(): T | undefined {
        if (this.isEmpty()) return undefined;

        const top = this.heap[0];
        const last = this.heap.pop()!;

        if (!this.isEmpty()) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }

        return top;
    }

    private bubbleUp(index: number): void {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);

            if (this.comparator(this.heap[index], this.heap[parent]) >= 0) {
                break;
            }

            this.swap(index, parent);
            index = parent;
        }
    }

    private bubbleDown(index: number): void {
        const length = this.size();

        while (true) {
            const left = index * 2 + 1;
            const right = index * 2 + 2;
            let smallest = index;

            if (
                left < length &&
                this.comparator(this.heap[left], this.heap[smallest]) < 0
            ) {
                smallest = left;
            }

            if (
                right < length &&
                this.comparator(this.heap[right], this.heap[smallest]) < 0
            ) {
                smallest = right;
            }

            if (smallest === index) break;

            this.swap(index, smallest);
            index = smallest;
        }
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}
