export const parseChatbotOutput = (rawText) => {
    if (typeof rawText !== "string") {
        return ""
    }

    const normalized = rawText
        .replace(/```[\s\S]*?```/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/\r\n/g, "\n")

    const lines = normalized.split("\n")
    const cleanedLines = []

    for (const line of lines) {
        const trimmed = line.trim()

        if (!trimmed) {
            cleanedLines.push("")
            continue
        }

        // Drop markdown horizontal rules.
        if (/^(-{3,}|_{3,}|\*{3,})$/.test(trimmed)) {
            continue
        }

        // Convert markdown headings to plain text lines.
        if (/^#{1,6}\s+/.test(trimmed)) {
            cleanedLines.push(trimmed.replace(/^#{1,6}\s+/, ""))
            continue
        }

        // Convert markdown table rows into readable inline lines.
        if (trimmed.includes("|")) {
            const cells = trimmed
                .split("|")
                .map((cell) => cell.trim())
                .filter(Boolean)

            // Skip table divider rows like |---|---|.
            const isDivider = cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell))
            if (isDivider) {
                continue
            }

            if (cells.length > 1) {
                cleanedLines.push("- " + cells.join(" | "))
                continue
            }
        }

        // Normalize markdown bullets.
        if (/^[-*+]\s+/.test(trimmed)) {
            cleanedLines.push("- " + trimmed.replace(/^[-*+]\s+/, ""))
            continue
        }

        cleanedLines.push(trimmed)
    }

    return cleanedLines
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}
