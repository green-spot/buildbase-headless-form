<script lang="ts">
  import { Styles } from "@sveltestrap/sveltestrap";
  import FieldList from "./lib/FieldList.svelte";
  import type { Field } from "./types";

  export let data: Field[] = []
  export let save: (data: Field[]) => void
</script>

<Styles theme="light" />
<FieldList {data} {save} />
