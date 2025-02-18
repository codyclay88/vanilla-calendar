export class ConfigFormInterceptor {
  constructor(formEl) {
    this.formEl = formEl;

    this.formEl.addEventListener("submit", this.onSubmit.bind(this));
  }

  onSubmit(e) {
    e.preventDefault();

    document.dispatchEvent(
      new CustomEvent("configChange", {
        detail: {
          ...getConfig(),
        },
      })
    );
  }
}
