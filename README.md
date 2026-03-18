# Pixel Online

Pixel Online is a project that aims at supporting users to create and explore pixel art with an intuitive, browser-based editor. Users can start from a blank canvas or import images, and then bring their ideas to life using tools such as brush, bucket, and eraser. The interface is designed to be accessible while still offering creative control over every pixel.

In addition to basic pixel-level editing, the application integrates advanced image processing techniques. Supported algorithms include **box filter**, **Gaussian blur**, and a **Rapid, Detail-Preserving Image Downscaling (DPID) algorithm**, which allow users to transform existing images into pixel art images with ease.

Future updates will focus on expanding the user interface and adding more tools to streamline the creative process, providing both beginners and advanced users with a richer and more user-friendly pixel art experience.

Here is the [website](https://kkkkejames.github.io/PixelOnline/) of this project.

# Pixel Online: Feature-Preserving Downscaling & Pixelation
This project is an engineering implementation of research on **Detail-Preserving Image Downscaling (DPID)**, transitioned from OpenCV & WebGL prototypes to a high-performance Web-based environment.

---

## Algorithm & Research
### 1. DPID Implementation (Detail-Preserving)
* **Research Basis:** Reimplemented the DPID algorithm to overcome the limitations of Bilinear/Bicubic interpolation in pixel art synthesis.
* **Math Foundation:** Calculated Euclidean distance in RGB space to define sampling weights:
  $$W(p, q) = (\frac{\|I(p) - I(q)\|}{V_{max}})^\lambda$$
* **Result:** Successfully preserved high-frequency edges and critical visual anchors during extreme downscaling (e.g., 512px to 32px).

### 2. Cross-Platform Evolution
* **Phase 1 (C++/OpenCV):** Initial algorithm verification and kernel parameter tuning.
* **Phase 2 (WebGL):** Explored GPU-accelerated image processing for real-time filtering.
* **Phase 3 (Canvas/TypedArray):** Final deployment using raw pixel manipulation. Optimized memory throughput by using `Uint32Array` and bitwise channel extraction (`(pixel >> 16) & 0xFF`).

---

## Technical Highlights
* **Manual Kernel Convolution:** Hand-written Gaussian and Box filters to ensure pixel-perfect control, avoiding browser-specific interpolation artifacts.
* **Bitwise Optimization:** Reduced RGBA processing overhead by treating colors as 32-bit integers, bypassing heavy object creation.

---

## References
* **Paper:** Weber, N., et al. (2016). *Rapid, Detail-Preserving Image Downscaling*. [DOI: 10.1111/cgf.13019](https://doi.org/10.1111/cgf.13019)
* **Prototype:** OpenCV-based implementation for algorithm benchmarking.