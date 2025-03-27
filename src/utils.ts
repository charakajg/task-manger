
export type Frequency = "daily" | "weekly" | "monthly";

type TimeUnit = "days" | "weeks" | "months";

const frequencyMapper: Record<Frequency, TimeUnit> = {
    daily: "days",
    weekly: "weeks",
    monthly: "months",
};

// Function to map frequency values
export function mapFrequency(frequency: Frequency): TimeUnit {
    return frequencyMapper[frequency];
}
