<script setup>
import IconsLink from "components/icons/Link.vue";
import { Notify } from "quasar";
import IconsCheck from "components/icons/Check.vue";
import { ref, watch } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});

const isCopied = ref(false);
let copiedTimeout = null;

watch(isCopied, (value) => {
  if (value) {
    clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => (isCopied.value = false), 2000);
  }
});

function copyToClipboard() {
  const textToCopy = props.value;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        isCopied.value = true;
        Notify.create({
          type: "positive",
          html: false,
          textColor: "white",
          message: "UUID скопирован!",
        });
      })
      .catch(() => {
        Notify.create({
          type: "negative",
          html: false,
          textColor: "white",
          message:
            "Ошибка копирования UUID. Обратитесь с ошибкой к администратору.",
        });
      });
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const success = document.execCommand("copy");
      if (success) {
        isCopied.value = true;
        Notify.create({
          type: "positive",
          html: false,
          textColor: "white",
          message: "UUID скопирован!",
        });
      } else {
        throw new Error("Ошибка выполнения команды copy");
      }
    } catch (error) {
      Notify.create({
        type: "negative",
        html: false,
        textColor: "white",
        message:
          "Ошибка копирования UUID. Обратитесь с ошибкой к администратору.",
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
</script>

<template>
  <div class="clipboard-value" @click="copyToClipboard">
    <span>{{ value }}</span>
    <icons-link v-if="!isCopied" />
    <icons-check v-else />
  </div>
</template>

<style lang="scss" scoped>
.clipboard-value {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 3px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s background-color;

  & .icon {
    min-width: 16px;
    font-size: 16px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
