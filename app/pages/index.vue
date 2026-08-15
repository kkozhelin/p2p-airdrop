<template>
    <div class="workspace">
        <section class="hero-header">
            <h1 class="hero-title">{{ $t('hero.title') }}</h1>
            <p class="hero-subtitle">
                {{ $t('hero.subtitle') }}
            </p>
        </section>

        <div class="workspace-grid">
            <div class="workspace-left">
                <FileDropzone @files-selected="handleFilesSelected" />
                <TransferProgressCard :progress="transferProgress" />
            </div>

            <div class="workspace-right">
                <PairingCard
                    :session-pin="sessionPin"
                    :connection-state="connectionState"
                    :error-message="errorMessage"
                    :is-files-selected="selectedFiles.length > 0"
                    @create-session="handleCreateSession"
                    @join-session="handleJoinSession"
                />
            </div>
        </div>

        <HostWaitingModal
            :is-open="isHostModalOpen"
            :pin="sessionPin"
            :connection-state="connectionState"
            :files-count="selectedFiles.length"
            :total-size-bytes="totalFilesSizeBytes"
            @cancel="handleCancelSession"
            @send-files="handleStartSend"
        />

        <PeerWaitingModal
            :is-open="isPeerModalOpen"
            :connection-state="connectionState"
            :files="pendingFilesMeta"
            @accept="acceptFileTransfer"
            @decline="declineFileTransfer"
            @disconnect="handleCancelSession"
        />

        <ReceivedFilesModal
            :is-open="isReceivedModalOpen"
            :files="receivedFilesList"
            @close="handleCloseReceivedModal"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FileDropzone from '~/components/FileDropzone.vue'
import PairingCard from '~/components/PairingCard.vue'
import HostWaitingModal from '~/components/HostWaitingModal.vue'
import PeerWaitingModal from '~/components/PeerWaitingModal.vue'
import ReceivedFilesModal from '~/components/ReceivedFilesModal.vue'
import TransferProgressCard from '~/components/TransferProgressCard.vue'
import { useWebRTC } from '~/composables/useWebRTC'

const { t } = useI18n()

useSeoMeta({
    title: () => t('seo.title'),
    description: () => t('seo.description'),
    ogTitle: () => t('seo.title'),
    ogDescription: () => t('seo.description')
})

const selectedFiles = ref<File[]>([])

const {
    connectionState,
    sessionPin,
    errorMessage,
    isHost,
    pendingFilesMeta,
    receivedFilesList,
    transferProgress,
    createSession,
    joinSession,
    cancelSession,
    requestFileTransfer,
    acceptFileTransfer,
    declineFileTransfer,
    clearReceivedFiles
} = useWebRTC()

const isHostModalOpen = computed(() => {
    return (
        isHost.value &&
        (connectionState.value === 'creating' ||
            connectionState.value === 'waiting' ||
            connectionState.value === 'connecting' ||
            connectionState.value === 'connected' ||
            connectionState.value === 'waiting_approval' ||
            connectionState.value === 'declined' ||
            (connectionState.value === 'disconnected' && receivedFilesList.value.length === 0))
    )
})

const isPeerModalOpen = computed(() => {
    return (
        !isHost.value &&
        (connectionState.value === 'connecting' ||
            connectionState.value === 'connected' ||
            connectionState.value === 'pending_approval' ||
            (connectionState.value === 'disconnected' && receivedFilesList.value.length === 0))
    )
})

const isReceivedModalOpen = computed(() => {
    return receivedFilesList.value.length > 0
})

const totalFilesSizeBytes = computed(() => {
    return selectedFiles.value.reduce((sum, file) => sum + file.size, 0)
})

const handleFilesSelected = (files: File[]) => {
    selectedFiles.value = files
}

const handleCreateSession = async () => {
    if (selectedFiles.value.length === 0) return
    await createSession()
}

const handleJoinSession = async (pin: string) => {
    await joinSession(pin)
}

const handleStartSend = () => {
    if (selectedFiles.value.length > 0) {
        requestFileTransfer(selectedFiles.value)
    }
}

const handleCancelSession = async () => {
    await cancelSession()
}

const handleCloseReceivedModal = () => {
    clearReceivedFiles()
    cancelSession()
}
</script>

<style lang="scss" scoped>
.workspace {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.hero-header {
    text-align: center;
    margin-bottom: 3.6rem;

    .hero-title {
        font-size: 3.2rem;
        font-weight: 800;
        background: linear-gradient(
            135deg,
            #ffffff 0%,
            $color-accent-cyan 55%,
            $color-accent-blue 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.05rem;
        margin-bottom: 0.8rem;
    }

    .hero-subtitle {
        font-size: 1.6rem;
        color: $color-text-secondary;
        max-width: 50rem;
        margin: 0 auto;
    }
}

.workspace-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.4rem;
    width: 100%;

    @include respond-to(tablet) {
        grid-template-columns: 1fr;
    }
}

.workspace-left,
.workspace-right {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    min-width: 0;
}
</style>
