<script setup lang="ts">
import { ApiClientError } from "@skill-port/api-client";

const api = useApiClient();

const { data, error, pending, refresh } = await useAsyncData(
  "dev-skill-options",
  () => api.skillOptions.list(),
);

const formattedError = computed(() => {
  const value = error.value;

  if (!value) {
    return null;
  }

  if (value instanceof ApiClientError) {
    return {
      name: value.name,
      statusCode: value.statusCode,
      code: value.code,
      message: value.message,
      response: value.response,
    };
  }

  return {
    name: value.name,
    message: value.message,
  };
});
</script>

<template>
  <main>
    <h1>Skill Options API Check</h1>

    <button type="button" @click="refresh()">Refresh</button>

    <p v-if="pending">Loading...</p>

    <section v-else-if="formattedError">
      <h2>Error</h2>
      <pre>{{ formattedError }}</pre>
    </section>

    <section v-else>
      <h2>Response</h2>
      <pre>{{ data }}</pre>
    </section>
  </main>
</template>
