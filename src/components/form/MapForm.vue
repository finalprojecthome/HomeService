<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import { computed, ref, watch } from "vue";
import { ErrorMessage, Field, useFieldError } from "vee-validate";
import cn from "../../utils/cn";
import ActionButton from "../ui/ActionButton.vue";

interface Props {
  latitudeName?: string;
  longitudeName?: string;
  label?: string;
  required?: boolean;
  rules?: string;
  class?: string;
  /** Map center when no pin is selected yet [lat, lng] */
  defaultCenter?: [number, number];
}

const props = withDefaults(defineProps<Props>(), {
  latitudeName: "latitude",
  longitudeName: "longitude",
  label: "ตำแหน่งบนแผนที่",
  defaultCenter: () => [13.7563, 100.5018],
});

const zoom = ref(13);
const center = ref<[number, number]>([...props.defaultCenter]);
const isGettingLocation = ref(false);
const locationError = ref("");

const latError = useFieldError(() => props.latitudeName);

const isFieldError = computed(() => Boolean(latError.value));

const latitudeRules = computed(() => {
  const rules = props.rules ?? "";
  if (props.required) {
    return "mapLatitudeRequired|mapLatitudeRange|" + rules;
  }
  return "mapLatitudeRange|" + rules;
});

const longitudeRules = computed(() => {
  const rules = props.rules ?? "";
  return "mapLongitudeRange|" + rules;
});

watch(
  () => props.defaultCenter,
  (next) => {
    if (next) {
      center.value = [...next];
    }
  },
  { deep: true },
);

function onMapClick(
  e: LeafletMouseEvent,
  changeLat: (v: number) => void,
  changeLng: (v: number) => void,
) {
  const { lat, lng } = e.latlng;
  setSelectedLocation(lat, lng, changeLat, changeLng);
}

function setSelectedLocation(
  lat: number,
  lng: number,
  changeLat: (v: number) => void,
  changeLng: (v: number) => void,
) {
  changeLat(lat);
  changeLng(lng);
  center.value = [lat, lng];
}

function useCurrentLocation(
  changeLat: (v: number) => void,
  changeLng: (v: number) => void,
) {
  locationError.value = "";
  if (!navigator.geolocation) {
    locationError.value = "เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง";
    return;
  }

  isGettingLocation.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      locationError.value = "";
      setSelectedLocation(
        position.coords.latitude,
        position.coords.longitude,
        changeLat,
        changeLng,
      );
      isGettingLocation.value = false;
    },
    () => {
      locationError.value = "ไม่สามารถระบุตำแหน่งปัจจุบันได้";
      isGettingLocation.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    },
  );
}
</script>

<template>
  <section class="flex flex-col gap-1 z-0">
    <header class="flex gap-0.5 w-fit style-headline-5">
      {{ label }}
      <span v-if="props.required" class="text-red">*</span>
    </header>
    <p class="style-body-4 text-gray-600">
      คลิกบนแผนที่ หรือใช้ปุ่มตำแหน่งปัจจุบันเพื่อเลือกพิกัดของที่อยู่
    </p>

    <Field
      :name="latitudeName"
      :rules="latitudeRules"
      v-slot="{ value: lat, handleChange: changeLat }"
    >
      <Field
        :name="longitudeName"
        :rules="longitudeRules"
        v-slot="{ value: lng, handleChange: changeLng }"
      >
        <ActionButton
          variant="ghost"
          :disabled="isGettingLocation"
          @click="useCurrentLocation(changeLat, changeLng)"
        >
          {{ isGettingLocation ? "กำลังระบุตำแหน่ง..." : "ใช้ตำแหน่งปัจจุบัน" }}
        </ActionButton>
        <div
          :class="
            cn(
              'w-full h-60 rounded-lg overflow-hidden border border-gray-300',
              isFieldError && 'border-red',
              props.class,
            )
          "
        >
          <l-map
            v-model:zoom="zoom"
            :center="center"
            @click="onMapClick($event, changeLat, changeLng)"
          >
            <l-tile-layer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              layer-type="base"
              name="OpenStreetMap"
            />
            <l-marker
              v-if="
                lat != null &&
                lng != null &&
                lat !== '' &&
                lng !== '' &&
                !Number.isNaN(Number(lat)) &&
                !Number.isNaN(Number(lng))
              "
              :lat-lng="[Number(lat), Number(lng)]"
            />
          </l-map>
        </div>
        <p
          v-if="
            lat != null &&
            lng != null &&
            lat !== '' &&
            lng !== '' &&
            !Number.isNaN(Number(lat)) &&
            !Number.isNaN(Number(lng))
          "
          class="style-body-4 text-gray-700"
        >
          {{ Number(lat).toFixed(6) }}, {{ Number(lng).toFixed(6) }}
        </p>
        <p v-if="locationError" class="style-body-4 text-red">
          {{ locationError }}
        </p>
      </Field>
    </Field>
    <ErrorMessage :name="latitudeName" class="style-body-4 text-red" as="p" />
  </section>
</template>
