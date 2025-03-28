import Signal from "@rbxts/signal";

/**
 * * Runs all tasks in array, destroys the tasks that didn't finish first.
 *   This is good for Checking events against eachother, or against timers
 * @param tasks The tasks to run
 * @returns The index of the first completed task
 */
export function raceAndTerminateTasks(tasks: Array<() => void>) {
    const threadMap: Array<thread> = [];
    const raceFinishedSignal = new Signal<(index: number) => void>();
    tasks.forEach((originalThread, index) => {
        const thread = task.spawn(() => {
            originalThread();
            raceFinishedSignal.Fire(index);
        });
        threadMap.push(thread);
    });
    const index = raceFinishedSignal.Wait()[0];
    threadMap.forEach((thread) => {
        task.cancel(thread);
    });
    return index;
}

/**
 * Works for character already exists, and characterAdded
 */
export function onCharacterAdded(player: Player, cb: (character: Model) => void) {
    if (player.Character) {
        cb(player.Character);
    }
    return player.CharacterAdded.Connect((character) => {
        cb(character);
    })
}

export function linearTimeout<T>(retries: number, retryTime: number, cb: () => T | undefined) {
    for (let i = 0; i < retries; i++) {
        if (i >= retries) return undefined;
        const res = cb();
        if (res !== undefined) return res;
        task.wait(retryTime);
    }
}