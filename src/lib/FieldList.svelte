<script lang="ts">
  import { Accordion, AccordionItem, FormCheck, FormGroup } from "@sveltestrap/sveltestrap";
  import type { Field, FieldType } from "../types";

  export let data: Field[]
  export let update: () => void = () => data = [...data]
  export let save: (data: Field[]) => void

  const fieldTypes = ["text", "email", "textarea", "select", "radio", "checkbox"]

  const createField: () => Field = () => {
    return {
      type: "text",
      name: "",
      label: "",
      props: {
        required: false
      }
    }
  }

  const buildSampleCode = (field: Field) => {
    const withLabel = (tag: string) => {
      if(field.label === "") return tag;
      return `<label for="*">${field.label}</label>\n${tag}`;
    }

    let propsString = ""
    if(field.props.pattern){
      propsString += ` pattern="${field.props.pattern}"`
    }

    if(field.props.placeholder){
      propsString += ` placeholder="${field.props.placeholder}"`
    }

    if(field.props.required){
      propsString += " required"
    }

    switch(field.type){
      case "text":
      case "email":
        return withLabel(`<input type="${field.type}" id="*" name="${field.name}"${propsString}>`)

      case "textarea":
        return withLabel(`<textarea id="*" name="${field.name}"${propsString}></textarea>`)

      case "checkbox":
      case "radio":
        if(field.props.choices?.length === 0) return "";
        return field.props.choices?.map(choice => {
          return `<input type="${field.type}" name="${field.name}" value="${choice.value}"> ${choice.label}`
        }).join("\n") || ""

      case "select":
        return `<label for="*">${field.label}</label>\n` +
          `<select id="*" name="${field.name}">\n` +
          (field.props.choices?.map(choice => {
            return `  <option value="${choice.value}">${choice.label}</option>\n`
          }) || []).join("") +
          `</select>`
    }

    return ""
  }

  const upField = (i: number) => {
    const _ = data[i]
    data[i] = data[i-1]
    data[i-1] = _
    update();
  }

  const downField = (i: number) => {
    const _ = data[i]
    data[i] = data[i+1]
    data[i+1] = _
    update();
  }

  const removeField = (i: number) => {
    data.splice(i, 1);
    update()
  }

  const addField = (i: number) => {
    data.splice(i, 0, createField())
    update()
  }

  const addChoice = (field: Field) => {
    if(!field.props.choices) field.props.choices = []
    field.props.choices.push({
      value: "",
      label: "",
      children: []
    })
    update()
  }

  const removeChoice = (field: Field, i: number) => {
    if(!field.props.choices) return;
    field.props.choices.splice(i, 1)
    update();
  }
</script>

{#each data as field, i}
{#if i !== 0}
<div class="my-2" style="line-height: 0;">
  <button type="button" class="add-button" on:click={() => addField(i)}></button>
</div>
{/if}

<div class="position-relative p-3 bg-white border">
  <div class="mb-2 d-flex justify-content-between">
    <pre style="color:#0d6efd;"><code>{buildSampleCode(field)}</code></pre>
  </div>

  <div class="control">
    <div>
      {#if i !== 0}
      <button type="button" class="up" on:click={() => upField(i)}>↑</button>
      {/if}
    </div>
    <div>
      {#if i < data.length - 1}
      <button type="button" class="down" on:click={() => downField(i)}>↓</button>
      {/if}
    </div>
    <div>
      <button type="button" class="remove" on:click={() => removeField(i)}>×</button>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <FormGroup floating label="Type">
        <select class="form-control form-select" bind:value={field.type} on:change={update}>
          {#each fieldTypes as type}
          <option value={type}>{type}</option>
          {/each}
        </select>
      </FormGroup>
    </div>

    <div class="col">
      <FormGroup floating label="name属性">
        <input type="text" bind:value={field.name} class="form-control">
      </FormGroup>
    </div>

    <div class="col">
      <FormGroup floating label="Label">
        <input type="text" bind:value={field.label} class="form-control">
      </FormGroup>
    </div>
  </div>

  <div class="mt-1">
    <Accordion>
      <AccordionItem>
        <div slot="header" style="font-size:.875rem;">詳細</div>

        <div class="pt-2">
          <FormCheck label="必須" class="mb-3" bind:checked={field.props.required}>
            <input type="checkbox">
          </FormCheck>

          {#if ["text"].includes(field.type)}
          <FormGroup floating label="pattern">
            <input type="text" bind:value={field.props.pattern} class="form-control">
          </FormGroup>
          {/if}

          {#if ["text", "email", "textarea"].includes(field.type)}
          <FormGroup floating label="placeholder">
            <input type="text" bind:value={field.props.placeholder} class="form-control">
          </FormGroup>
          {/if}

          {#if field.type === "email"}
          <FormGroup floating label="confirm field">
            <select bind:value={field.props.confirmField} class="form-control form-select">
              <option value="">-</option>
              {#each data as _field}
              {#if _field.type === "email" && field.name !== _field.name}
              <option value={_field.name}>{_field.name}</option>
              {/if}
              {/each}
            </select>
          </FormGroup>
          {/if}

          {#if ["checkbox", "radio", "select"].includes(field.type)}
          <table class="table">
            <thead>
              <tr>
                <th>value</th>
                <th>label</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {#each field.props.choices ?? [] as choice, j}
              <tr>
                <td><input type="text" bind:value={choice.value} class="form-control form-control-sm"></td>
                <td><input type="text" bind:value={choice.label} class="form-control form-control-sm"></td>
                <td>
                  <button type="button" class="btn btn-danger btn-sm" on:click={() => removeChoice(field, j)}>削除</button>
                </td>
              </tr>
              {/each}
              <tr>
                <td></td>
                <td></td>
                <td>
                  <button type="button" class="btn btn-primary btn-sm" on:click={() => addChoice(field)}>追加</button>
                </td>
              </tr>
            </tbody>
          </table>
          {/if}
        </div>
      </AccordionItem>
    </Accordion>
  </div>
</div>
{/each}

<div class="my-2">
  <button type="button" class="add-button active" on:click={() => addField(data.length)}></button>
</div>

<hr>

<button type="button" class="btn btn-success" on:click={() => save(data)}>保存</button>

<style>
  .control {
    position: absolute;
    top: -14px;
    right: 10px;
    display: flex;
    gap: 8px;

    & div {
      width: 24px;
    }

    & button {
      width: 24px;
      height: 24px;
      padding: 0;
      border: 1px solid #0d6efd;
      border-radius: 50%;
      color: #0d6efd;
      font-size: 12px;
      line-height: 18px;
      background-color: #fff;

      &.remove {
        border-color: #dc3545;
        color: #dc3545;
      }
    }
  }

  .add-button {
    display: block;
    position: relative;
    width: 100%;
    padding: .5rem 0;
    border: none;
    background-color: transparent;

    &:hover,
    &.active {
      padding: .75rem 0;
      background-color: #0d6efd;

      &::before {
        content: "+";
        position: absolute;
        top: 50%;
        left: 50%;
        color: #fff;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>