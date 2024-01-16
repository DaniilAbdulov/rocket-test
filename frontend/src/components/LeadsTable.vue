<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      ref="tableRef"
      title="Сделки"
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :loading="loading"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="accent"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
            />
          </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :style="
              col.name === 'status_name'
                ? {
                    backgroundColor: props.row.status_color,
                  }
                : {}
            "
          >
            {{ col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              {{ props.row.contact_name }}

              <q-btn
                v-if="props.row.contact_phone"
                flat
                round
                color="blue"
                icon="phone"
                @click="makePhoneCall(props.row.contact_phone)"
              >
              </q-btn>
              <q-btn
                v-if="props.row.contact_email"
                flat
                round
                color="blue"
                icon="email"
                @click="sendEmail(props.row.contact_email)"
              >
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input
          bordered
          dense
          debounce="300"
          v-model="filter"
          placeholder="Поиск"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';
import { Column, Pagination, RequestProps, Rows } from './models';

export default {
  //методы, срабатывающие при нажатии на кнопки вызова и почты
  methods: {
    makePhoneCall(phoneNumber: string) {
      window.__cpLocation.href = `tel:${phoneNumber}`;
    },
    sendEmail(email: string) {
      window.__cpLocation.href = `mailto:${email}`;
    },
  },
  setup() {
    const tableRef: Ref<unknown> = ref();
    const rows: Ref<Rows[]> = ref([]);
    //колонки таблицы
    const columns: Ref<Column[]> = ref([
      {
        name: 'name',
        label: 'Название',
        field: 'name',
        align: 'left',
      },
      { name: 'price', label: 'Бюджет', field: 'price', align: 'left' },
      {
        name: 'status_name',
        label: 'Статус',
        field: 'status_name',
        align: 'left',
      },
      { name: 'user', label: 'Ответственный', field: 'user', align: 'left' },
      {
        name: 'created_at',
        label: 'Дата создания',
        field: 'created_at',
        align: 'left',
      },
    ]);
    //строка поиска. по-умолчанию пустая строка
    const filter: Ref<string> = ref('');
    //переменная, отвечающая за отображание лоудера
    const loading: Ref<boolean> = ref(false);
    //данные для запроса на сервер с определленным лимитом
    const pagination: Ref<Pagination> = ref({
      descending: false,
      page: 1,
      rowsPerPage: 5,
      rowsNumber: 10,
    });
    //функция запроса данных с сервера
    const fetchFromServer = (
      page: number,
      rowsPerPage: number,
      filter: string
    ) => {
      // параметры запроса(номер страницы, кол-во записей и поисковый запрос)
      const params = new URLSearchParams({
        _page: String(page),
        _limit: String(rowsPerPage),
        q: filter,
      });

      // запрос на соответсвующий эндпоинт в backend
      const url = `http://localhost:3030/api/leads?${params.toString()}`;
      return axios.get(url);
    };
    //функция @request="onRequest" предоставляемая компонентом таблицы quasar q-table
    const onRequest = async (props: RequestProps) => {
      //считываем данные для запроса
      const { page, rowsPerPage } = props.pagination;
      const filterValue = props.filter;
      //активиурем лоудер
      loading.value = true;

      try {
        // вызываем функцию fetchFromServer с заданными параметрами
        const response = await fetchFromServer(page, rowsPerPage, filterValue);

        // устанавливаем новые значения строк
        const results: Rows[] = response.data.results;
        rows.value = results;
        // устанавливаем кол-во всех сделок
        const totalRows: number = response.data.totalRows;
        pagination.value.rowsNumber = totalRows; 

        // обновляем объект пагинации в строке 146
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
      } catch (error) {
        console.error('There was an error fetching the data: ', error);
      } finally {
        //независимо от ответа сервера отключаем лоудер
        loading.value = false;
      }
    };
    //вызываем функцию при монтировании компонента с дефолтными значениями
    onMounted(() => {
      onRequest({
        pagination: pagination.value,
        filter: filter.value,
      });
    });

    return {
      tableRef,
      filter,
      columns,
      loading,
      pagination,
      rows,
      onRequest,
    };
  },
};
</script>
<style scoped>
.q-table .q-td {
  text-align: left;
}
</style>
