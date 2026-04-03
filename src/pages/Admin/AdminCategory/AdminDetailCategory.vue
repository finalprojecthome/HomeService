<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminSidebar from "../../../components/admin/AdminSidebar.vue";
import ActionButton from "../../../components/ui/ActionButton.vue";
import Icon from "../../../components/ui/Icon.vue";
import { getAdminCategoryById } from "../../../services/AdminCategory";
import { formatDate } from "../../../utils/formatDateAdmin";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

const router = useRouter();
const route = useRoute();

const backIconPath = "M15.75 19.5L8.25 12l7.5-7.5";

// ===== Route Context =====
// Responsibility: show a read-only category detail view for the selected route param.
const categoryId = computed(() => {
  const rawId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  const parsedId = Number(rawId);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
});

const categoryName = ref("");
const createdAt = ref("");
const updatedAt = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

onMounted(() => {
  void fetchCategory();
});

function goToCategoryList() {
  router.push("/admin/category");
}

function goToEditCategory() {
  if (categoryId.value === null) {
    return;
  }

  router.push(`/admin/category/${categoryId.value}/edit`);
}

// ===== Data Fetching =====
// Responsibility: retrieve the selected category for a read-only admin detail view.
async function fetchCategory() {
  if (categoryId.value === null) {
    errorMessage.value = "ไม่พบรหัสหมวดหมู่ที่ต้องการดูรายละเอียด";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const category = await getAdminCategoryById(categoryId.value);
    categoryName.value = category.name;
    createdAt.value = formatDate(category.createdAt);
    updatedAt.value = formatDate(category.updatedAt);
  } catch (error) {
    errorMessage.value = getApiErrorMessage(error, "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex min-h-screen">
      <aside>
        <AdminSidebar />
      </aside>

      <main class="flex-1 overflow-x-hidden bg-bg-gray">
        <section class="flex min-h-screen flex-col">
          <header
            class="flex flex-col gap-4 px-[35px] py-[17px] bg-white md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex items-center justify-center w-10 h-10 rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="isLoading"
                aria-label="Back to category list"
                @click="goToCategoryList"
              >
                <Icon :path="backIconPath" class="w-5 h-5" />
              </button>

              <div class="min-w-0">
                <p class="style-body-4 text-gray-500">หมวดหมู่</p>
                <h1 class="style-headline-3 truncate text-gray-950">
                  {{ categoryName || "รายละเอียดหมวดหมู่" }}
                </h1>
              </div>
            </div>

            <div class="flex justify-end">
              <ActionButton
                class="justify-center min-w-[97px]"
                :disabled="categoryId === null || isLoading"
                @click="goToEditCategory"
              >
                แก้ไข
              </ActionButton>
            </div>
          </header>

          <div class="flex-1 px-[35px] py-[35px]">
            <p v-if="errorMessage" class="mb-4 style-body-2 text-red">
              {{ errorMessage }}
            </p>

            <div
              class="rounded-[8px] border border-gray-200 bg-white px-[16px] py-[22px] style-shadow"
            >
              <div class="grid gap-[16px] md:grid-cols-[126px_minmax(0,1fr)] md:gap-[18px]">
                <p class="pt-[10px] style-body-5 text-gray-700">ชื่อหมวดหมู่</p>
                <p class="pt-[10px] style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : categoryName || "-" }}
                </p>
              </div>

              <div class="my-6 h-px bg-gray-200" />

              <div class="grid gap-4 md:grid-cols-[126px_minmax(0,1fr)] md:gap-y-6">
                <p class="style-body-5 text-gray-700">สร้างเมื่อ</p>
                <p class="style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : createdAt || "-" }}
                </p>

                <p class="style-body-5 text-gray-700">แก้ไขล่าสุด</p>
                <p class="style-body-3 text-gray-900">
                  {{ isLoading ? "กำลังโหลดข้อมูล..." : updatedAt || "-" }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
