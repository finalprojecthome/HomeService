<script setup lang="ts">
import type { UserAddress } from "../../types/user";
import { useRouter } from "vue-router";

interface Props {
  address: UserAddress;
}

const props = defineProps<Props>();
const router = useRouter();

const fullAddress = `${props.address.addressDetail}, ${
  props.address.province.name === "กรุงเทพมหานคร"
    ? `แขวง${props.address.subDistrict.name}, เขต${props.address.district.name}`
    : `ตำบล${props.address.subDistrict.name}, อำเภอ${props.address.district.name}`
}, จังหวัด${props.address.province.name}, ${props.address.postCode}`;

const handleClick = () => {
  void router.push(`/address/edit/${props.address.id}`);
};
</script>

<template>
  <article
    class="flex flex-col gap-2 w-full p-4 bg-white rounded-lg style-card-box cursor-pointer hover:style-shadow"
    @click="handleClick"
  >
    <h2 class="style-headline-2 text-gray-900">{{ address.addressName }}</h2>
    <p class="style-body-2 text-gray-800">{{ fullAddress }}</p>
  </article>
</template>
