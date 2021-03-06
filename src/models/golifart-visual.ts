import { StopWatch } from "../helpers/stopwatch";
import { Player } from "./player";

const FART_TIMEOUT_MS = 150;
const FART_MAX_SIZE = 140;
const FART_START_SIZE = 120;
const FART_GROW_PER_MS = (FART_MAX_SIZE - FART_START_SIZE) / FART_TIMEOUT_MS;

export class GoliFartVisual {
    public player: Player;

    private stopwatch = new StopWatch();

    public get isFinished(): boolean {
        return this.stopwatch.elapsedMs > FART_TIMEOUT_MS;
    }

    public get size(): number {
        return FART_START_SIZE + this.stopwatch.elapsedMs * FART_GROW_PER_MS;
    }
}
