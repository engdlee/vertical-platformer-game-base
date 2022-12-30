/**
 * The CanvasContext class defines the `getInstance` method that lets clients access
 * the unique CanvasContext instance.
 */
export class CanvasContext {
  private static instance: CanvasContext;
  canvas: HTMLCanvasElement | null;
  c: CanvasRenderingContext2D | null | undefined;
  gravity = 0.5;

  /**
   * The CanvasContext's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.canvas = document.querySelector<HTMLCanvasElement>("#app");
    if (this.canvas) {
      this.c = this.canvas.getContext("2d");
    }
  }

  /**
   * The static method that controls the access to the CanvasContext instance.
   *
   * This implementation let you subclass the CanvasContext class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): CanvasContext {
    if (!CanvasContext.instance) {
      CanvasContext.instance = new CanvasContext();
    }

    return CanvasContext.instance;
  }

  /**
   * Finally, any CanvasContext should define some business logic, which can be
   * executed on its instance.
   */
  public setC() {
    // canvas = document.querySelector<HTMLCanvasElement>("#app");
  }
}
