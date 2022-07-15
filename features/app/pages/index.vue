<script lang="ts" setup>
import homeLoader from '../loaders/homeLoader';

const { t } = useI18n();

const {
  pokemonOfTheDay: { isLoading, data: pokemonOfTheDay }
} = homeLoader.load();
</script>

<template>
  <div max-w="full" space-y="4" w="screen-sm">
    <UiSurface
      flex
      flex-col
      gap="5"
      items="center"
      justify="center"
      p-y="15"
      text-center
    >
      <p text="3xl">{{ t('title') }}</p>

      <p text="xl">{{ t('subtitle') }}</p>
    </UiSurface>

    <UiSurface space-y="3">
      <h2 lt-sm="text-center" text="2xl" weight-bold>{{ t('potd.title') }}</h2>
      <div mx="auto" space-y="5">
        <figure capitalize flex gap="3" lt-sm="flex-wrap">
          <div flex flex-row justify-center m-x="auto" w="sm:full">
            <div
              v-if="isLoading"
              animate-pulse
              aspect-square
              bg="light-300 dark:dark-300"
              w="35"
            />
            <div v-else-if="pokemonOfTheDay" bg="light-300 dark:dark-300" w-35>
              <UiImage
                :alt="pokemonOfTheDay.name"
                crossorigin="anonymous"
                height="100"
                :src="pokemonOfTheDay.sprites.default"
                w-full
                width="100"
              />
            </div>
          </div>

          <figcaption v-if="pokemonOfTheDay" max-w="40ch">
            <div lt-sm="text-center" text="xl">
              {{ pokemonOfTheDay.name }}
            </div>
            <p>{{ pokemonOfTheDay.description }}</p>

            <AppLink
              flex
              float-right
              gap="4"
              items-center
              prefetch
              :to="`/pokemon/${pokemonOfTheDay.name}`"
              underline
            >
              See more
              <span i-ui-chevron-right />
            </AppLink>
          </figcaption>
        </figure>
      </div>
    </UiSurface>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Welcome to the online Pokédex !",
    "subtitle": "Click on a pokemon in the sidebar to see its detail.",
    "potd": {
      "title": "Pokémon spotlight"
    }
  }
}
</i18n>
