<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import AddressTile from "./AddressTile.vue";
import AddressTileSkeleton from "./AddressTileSkeleton.vue";
import NavigationButton from "../ui/NavigationButton.vue";
import { PlusIcon } from "../icons";
import { MAX_ADDRESS_COUNT } from "../../constants/address";
import { useAddressStore } from "../../stores";

const addressStore = useAddressStore();
const { addresses, isLoading } = storeToRefs(addressStore);

onMounted(async () => {
  await addressStore.fetchAddresses();
});
</script>

<template>
  <section class="flex flex-col gap-4">
    <template v-if="isLoading">
      <AddressTileSkeleton />
      <AddressTileSkeleton />
      <AddressTileSkeleton />
    </template>
    <AddressTile
      v-for="address in addresses"
      v-else
      :key="address.id"
      :address="address"
    />
    <article
      v-if="!isLoading && addresses.length < MAX_ADDRESS_COUNT"
      class="flex flex-col items-center gap-2 w-full p-4 bg-white rounded-lg style-card-box"
    >
      <NavigationButton variant="icon" to="/address/add">
        <PlusIcon />
      </NavigationButton>
      <span class="style-body-2 text-gray-800">เพิ่มที่อยู่</span>
    </article>
  </section>
</template>
