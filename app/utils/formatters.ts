export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const getFileIcon = (file: File): string => {
    const type = file.type
    const extension = file.name.split('.').pop()?.toLowerCase() || ''

    if (type.startsWith('image/')) return '🖼️'
    if (type.startsWith('video/')) return '🎥'
    if (type.startsWith('audio/')) return '🎵'
    if (type.includes('pdf')) return '📄'
    if (
        type.includes('zip') ||
        type.includes('rar') ||
        ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)
    ) {
        return '📦'
    }
    if (['js', 'ts', 'vue', 'json', 'html', 'css', 'py', 'cpp', 'rs'].includes(extension)) {
        return '💻'
    }

    return '📎'
}
