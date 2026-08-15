import { ref } from 'vue'
import { PAIRING_CONFIG } from '~/constants/app'

/**
 * Composable для копирования текста в буфер обмена.
 * Автоматически сбрасывает флаг `isCopied` через COPY_RESET_TIMEOUT_MS.
 */
export function useCopyToClipboard() {
    const isCopied = ref<boolean>(false)

    const copy = async (text: string): Promise<void> => {
        if (!text) return
        try {
            await navigator.clipboard.writeText(text)
            isCopied.value = true
            setTimeout(() => {
                isCopied.value = false
            }, PAIRING_CONFIG.COPY_RESET_TIMEOUT_MS)
        } catch {}
    }

    return { isCopied, copy }
}
