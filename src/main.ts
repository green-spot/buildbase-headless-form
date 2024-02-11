import App from './App.svelte';
import type { Field } from './types';

type Props = {
  structure: string,
  updateURL: string,
  formId: number,
  csrfToken: string
}

export const mountApp: (target: string, props: Props) => Promise<void> = async (target, props) => {
  const res = await fetch(props.structure)
  const data = await res.json()

  const save = async (data: Field[]) => {
    const formData = new FormData

    formData.set("csrf-token", props.csrfToken);
    formData.set("data", JSON.stringify({
      id: props.formId,
      fields: data
    }));

    await fetch(props.updateURL, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      body: formData
    })

    location.href = location.href
  }

  const app = new App({
    target: document.querySelector(target),
    props: {
      data,
      save
    }
  });

  // return app;
}
