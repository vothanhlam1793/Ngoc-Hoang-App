<template>
    <div>
      <b-table
        :items="objectToArray(objectWithKeyValuePairs)"
        borderless
        striped
        outlined
        hover
      >
        <template v-for="key in objectKeys">
          <b-table-column
            :key="key"
            :label="keyToLabel(key)"
            :field="key"
          >
            <template #cell(key)="data">
              {{ keyToLabel(data.value) }}
            </template>
          </b-table-column>
        </template>
      </b-table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        objectWithKeyValuePairs: {
          key1: "value1",
          key2: "value2",
          key3: "value3"
        },
        keyLabels: {
          key1: "Label 1",
          key2: "Label 2",
          key3: "Label 3"
        }
      };
    },
    computed: {
      objectKeys() {
        return Object.keys(this.objectWithKeyValuePairs);
      }
    },
    methods: {
      objectToArray(obj) {
        const arr = [];
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            arr.push({ key, value: obj[key] });
          }
        }
        return arr;
      },
      keyToLabel(key) {
        return this.keyLabels[key] || key;
      }
    }
  };
  </script>
  