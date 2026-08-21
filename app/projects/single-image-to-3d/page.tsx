import Link from "next/link";
import {
  Bibtex,
  Callout,
  CodeBlock,
  CubeIcon,
  Diagram,
  DocIcon,
  Figure,
  FigureRow,
  GithubIcon,
  Math,
  MathBlock,
  PaperHero,
  PaperSection,
  Prose,
  ResultsTable,
} from "@/components/paper";

const REPO = "https://github.com/ashma2583/3D-Reconstruction-Pipeline";
const RAW = "https://raw.githubusercontent.com/ashma2583/3D-Reconstruction-Pipeline/main";
const img = (path: string) => `${RAW}/${path}`;

export const metadata = {
  title: "Single Image to 3D — Ashton Ma",
  description:
    "One photo in, an orbitable 3D model out. Diffusion, NeRF, and a Gaussian splatting rasterizer implemented from scratch in PyTorch and wired to a pretrained multi-view diffusion model.",
};

export default function SingleImageTo3D() {
  return (
    <article className="mx-auto max-w-5xl">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-[var(--accent)]"
      >
        <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
        All projects
      </Link>

      <div className="mt-10">
        <PaperHero
          eyebrow="Personal project · 2026"
          title="Single Image to 3D"
          subtitle="One photo in, an orbitable 3D model out."
          authors={[{ name: "Ashton Ma", href: "https://github.com/ashma2583" }]}
          // affiliation="University of Michigan"
          links={[
            { label: "Code", href: REPO, icon: GithubIcon, primary: true },
            // { label: "Theory write-up", href: `${REPO}/blob/main/PIPELINE.md`, icon: DocIcon },
            // {
            //   label: "Code walkthrough",
            //   href: `${REPO}/blob/main/CODE_WALKTHROUGH.md`,
            //   icon: DocIcon,
            // },
            // { label: "View a .ply", href: "https://supersplat.polycam.com", icon: CubeIcon },
          ]}
        />
      </div>

      <Figure
        src={img("pipeline/pipeline_turntable.gif")}
        alt="Turntable render of the reconstructed car, orbiting the model produced end to end from a single photo"
        maxWidth={420}
        caption=""
      />

      {/* ------------------------------- Overview ------------------------------ */}

      <PaperSection title="Overview">
        <Prose>
          <p>
            This project closes the loop from a single photograph to an orbitable 3D model. The
            diffusion model, the NeRF, and the Gaussian splatting rasterizer are all implemented
            from scratch in PyTorch, then wired together with a pretrained multi-view diffusion
            model that supplies the generative prior.
          </p>
          <p>
            The piece that makes the two halves fit is a pose bridge. Zero123++ reports its
            generated views as spherical angles; the reconstructors want camera matrices in the
            Blender dataset format. Once the bridge writes that format, every existing loader and
            trainer runs unchanged.
          </p>
          <p>
            The end-to-end output is blurry, and understanding <em>why</em> is the most interesting
            result here. The same reconstructor scores roughly the same PSNR on 6 generated views
            as it does on 100 real photographs — while generalizing to nothing. That gap is what
            the analysis below is about.
          </p>
        </Prose>
      </PaperSection>

      {/* ------------------------------- Pipeline ------------------------------ */}

      <PaperSection title="Pipeline">
        <Diagram
          caption="Every stage, and the file that implements it. The pose bridge is the seam between the generative half and the reconstruction half."
        >{`   one photo
       │
       │   preprocess_image.py        rembg matte, crop to bbox, center on white
       ▼
   clean object on a plain background
       │
       │   single_image_to_views.py   Zero123++ generates 6 views at fixed poses
       ▼                              azimuth   30  90 150 210 270 330
   6 novel views                      elevation 30 -20  30 -20  30 -20
       │
       │   pose_bridge.py             (az, el, r) → look_at → 4x4 camera-to-world
       ▼                              + matte the grey background to alpha
   Blender-format posed dataset
       │
       │   train_gs.py                fit 3D Gaussians to the posed views
       ▼   (or train_nerf.py)
   3D model
       │
       │   export_ply.py
       ▼
   .ply you can orbit in a browser`}</Diagram>

        <div className="mt-10">
          <Prose>
            <p>
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-neutral-900">
                run_pipeline.py
              </code>{" "}
              chains the whole thing and skips the diffusion step when its output already exists.
              Output lands in{" "}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-neutral-900">
                pipeline/gs_car.ply
              </code>{" "}
              and opens in{" "}
              <a
                href="https://superspl.at/"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                SuperSplat
              </a>{" "}
              by drag and drop.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* -------------------------------- Results ------------------------------ */}

      <PaperSection title="Results">
        <Prose>
          <p>
            A 1947 Rover photographed in a museum, background and all, run through the full
            pipeline. The back of this car appears in no input. The generated views invent a
            plausible one, which is the entire reason to use a generative prior instead of pure
            photogrammetry.
          </p>
        </Prose>

        <FigureRow
          cols={3}
          items={[
            {
              src: img("pipeline/test_car.jpg"),
              alt: "Original museum photograph of a 1947 Rover",
              label: "input photo",
            },
            {
              src: img("multiview_diffusion/outputs/input_car.png"),
              alt: "The same car matted, cropped and centered on white",
              label: "preprocessed",
            },
            {
              src: img("multiview_diffusion/outputs_car/views_grid.png"),
              alt: "Grid of six novel views generated by Zero123++",
              label: "6 generated views",
            },
          ]}
          caption="rembg mattes the object and crops to its bounding box; Zero123++ then hallucinates six views at fixed known poses."
        />

        <ResultsTable
          head={["Stage", "Result"]}
          rows={[
            ["DDPM, 5 epochs", "loss 1.21 → 0.022"],
            ["DDPM + EMA, 20 epochs", "loss → 0.0169"],
            ["NeRF, single network, 20k iters @ 200px", <strong key="a">26.97 dB</strong>],
            ["NeRF, hierarchical, 20k iters @ 200px", <strong key="b">30.03 dB</strong>],
            ["3DGS, 7k Gaussians, 7k iters @ 100px", <strong key="c">~24–25 dB</strong>],
            ["Zero123++, one image → six views", "~24 s"],
            [
              "Full pipeline",
              <strong key="d">24.5 dB on its 6 training views</strong>,
            ],
          ]}
          caption=""
        />

        <div className="mt-10">
          <Prose>
            <p>
              The NeRF number beating the 3DGS number is not a ranking. The NeRF ran at 200px with
              hierarchical sampling; the 3DGS used a fixed 7k Gaussians at 100px with no
              densification and no spherical harmonics. Given both of those, 3DGS usually matches or
              beats NeRF and renders far faster. Both are implemented for coverage of the two
              dominant representations, not as a benchmark between them.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* ------------------------------- Diffusion ----------------------------- */}

      <PaperSection title="Diffusion">
        <Prose>
          <p>
            Learning the foundation. Noise is
            added in closed form, so any timestep is one step away from the clean image:
          </p>
        </Prose>

        <MathBlock tag="1">
          {String.raw`x_t = \sqrt{\bar{\alpha}_t}\, x_0 \;+\; \sqrt{1 - \bar{\alpha}_t}\, \varepsilon,
            \qquad \varepsilon \sim \mathcal{N}(\mathbf{0}, \mathbf{I})`}
        </MathBlock>

        <Figure
          src={img("pictures/forward_process.png")}
          alt="The forward diffusion process, a digit dissolving into noise across timesteps"
          maxWidth={760}
          caption={
            <>
              The forward process on MNIST. Every column is a single closed-form jump from{" "}
              <Math>{String.raw`x_0`}</Math>, not a chain of steps.
            </>
          }
        />

        <div className="mt-10">
          <Prose>
            <p>
              Training samples a random timestep, forms <Math>{String.raw`x_t`}</Math>, and
              minimizes{" "}
              <Math>{String.raw`L =\lVert \varepsilon - \hat{\varepsilon} \rVert^2`}</Math>.
              Sampling walks that
              backwards from pure noise over 1000 steps. The network is a small U-Net (1.87M
              parameters) with the timestep embedded once and added inside every residual block.
            </p>
          </Prose>
        </div>

        <FigureRow
          cols={2}
          maxWidth={720}
          items={[
            {
              src: img("pictures/samples.png"),
              alt: "Digit samples after 5 epochs of training with raw weights",
              label: (
                <>
                  <strong>5 epochs, raw weights</strong>
                  <br />
                  loss 0.022
                </>
              ),
            },
            {
              src: img("pictures/samples_ema.png"),
              alt: "Digit samples after 20 epochs using EMA weights",
              label: (
                <>
                  <strong>20 epochs with EMA</strong>
                  <br />
                  loss 0.0169
                </>
              ),
            },
          ]}
          caption=""
        />
      </PaperSection>

      {/* --------------------------------- NeRF -------------------------------- */}

      <PaperSection title="Neraul Radiance Field (NeRF)">
        <Prose>
          <p>
            A scene stored as a function from position and view direction to color and density,
            integrated along camera rays. Camera geometry is verified against analytic expectations
            before any training runs, since coordinate conventions are where this tends to break.
          </p>
        </Prose>

        <FigureRow
          cols={2}
          maxWidth={760}
          items={[
            {
              src: img("pictures/camera_setup.png"),
              alt: "Plot of camera positions and frustum rays around the scene",
              label: "cameras and frustum rays",
            },
            {
              src: img("pictures/ray_samples.png"),
              alt: "Stratified sample points distributed along camera rays",
              label: "stratified samples along rays",
            },
          ]}
          caption="Geometry checks before training. Cheaper to verify here than to debug through a blurry render."
        />

        <div className="mt-10">
          <Prose>
            <p>
              The MLP is 8 layers of width 256 (0.60M parameters) with the encoded position
              re-concatenated at layer 4. Density comes from position alone, keeping geometry
              consistent between views; color also takes the view direction, which is what allows
              specular highlights. Positional encoding lifts position from 3 dimensions to 63 and
              direction from 3 to 27. Without it, a ReLU MLP can only fit smooth low-frequency
              functions, and the result stays blurry no matter how long it trains.
            </p>
            <p>Rendering composites samples front to back:</p>
          </Prose>
        </div>

        <MathBlock tag="2">
          {String.raw`\begin{aligned}
            \alpha_i &= 1 - \exp(-\sigma_i \delta_i) \\[2pt]
            T_i &= \prod_{j<i} (1 - \alpha_j) \\[2pt]
            C &= \sum_i T_i\, \alpha_i\, c_i
          \end{aligned}`}
        </MathBlock>

        <div className="mt-10">
          <Prose>
            <p>
              Hierarchical sampling adds a second pass: run a coarse network, treat its rendering
              weights as a distribution over where the surface is, and draw 128 more samples from it
              rather than spending them on empty space.
            </p>
          </Prose>
        </div>

        <Callout label="Result">
          Inverse-CDF importance sampling is worth <strong>+3 dB</strong> — 26.97 dB to 30.03 dB —
          at the same scene, resolution, and iteration count.
        </Callout>

        <FigureRow
          cols={2}
          maxWidth={620}
          items={[
            {
              src: img("pictures/nerf_progress_20000.png"),
              alt: "NeRF render from the single-network run at 20k iterations",
              label: (
                <>
                  <strong>single network</strong>
                  <br />
                  26.97 dB
                </>
              ),
            },
            {
              src: img("pictures/nerf_hier_progress_20000.png"),
              alt: "NeRF render from the hierarchical coarse-plus-fine run at 20k iterations",
              label: (
                <>
                  <strong>coarse + fine</strong>
                  <br />
                  30.03 dB
                </>
              ),
            },
          ]}
          caption=""
        />

        <FigureRow
          cols={3}
          maxWidth={700}
          items={[
            {
              src: img("pictures/lego_turntable.gif"),
              alt: "Turntable animation of 40 novel NeRF views",
              label: "40 novel views",
            },
            {
              src: img("pictures/turntable_frame0.png"),
              alt: "Turntable frame 0",
              label: "frame 0",
            },
            {
              src: img("pictures/turntable_frame20.png"),
              alt: "Turntable frame 20",
              label: "frame 20",
            },
          ]}
          caption="The turntable renders angles that appear nowhere in the training set. Staying coherent from the front and the back is the evidence that the network learned geometry rather than memorizing photos."
        />
      </PaperSection>

      {/* --------------------------- Gaussian splatting ------------------------ */}

      <PaperSection title="Gaussian Splatting">
        <Prose>
          <p>
            The same problem with the opposite representation. Instead of querying an implicit
            function along rays, the scene is an explicit cloud of 3D Gaussians projected straight to
            the image.
          </p>
          <p>
            Optimizing a covariance matrix directly would wander into invalid non-PSD matrices, so it
            is factored as <Math>{String.raw`\Sigma = R S S^{\top} R^{\top}`}</Math> with
            scales stored as logs and rotation as a quaternion. Any parameter values then give a
            valid ellipsoid. That comes to 14 optimized numbers per Gaussian.
          </p>
          <p>
            Rendering projects each Gaussian to a 2D ellipse with the EWA splatting Jacobian,
            depth-sorts globally, and alpha-composites using the same exclusive-cumprod transmittance
            as the NeRF volume renderer. The two representations meet at identical compositing math.
          </p>
          <p>
            Training renders a full image per step under L1 loss, with a separate Adam learning rate
            per attribute. Positions move roughly 300× slower than opacities; larger steps scatter
            the cloud and it does not recover.
          </p>
        </Prose>

        <FigureRow
          cols={4}
          items={[
            {
              src: img("pictures/gs_progress_1000.png"),
              alt: "Gaussian splatting render at 1000 iterations",
              label: "1000 iters",
            },
            {
              src: img("pictures/gs_progress_3000.png"),
              alt: "Gaussian splatting render at 3000 iterations",
              label: "3000 iters",
            },
            {
              src: img("pictures/gs_progress_7000.png"),
              alt: "Gaussian splatting render at 7000 iterations",
              label: "7000 iters",
            },
            {
              src: img("pictures/gs_lego_turntable.gif"),
              alt: "Turntable animation of the fitted Gaussian cloud",
              label: "turntable",
            },
          ]}
          caption="7k Gaussians converging on the lego scene under L1 loss."
        />

        <div className="mt-10">
          <Prose>
            <p>
              Two pieces of the paper are absent, and both cap sharpness: the Gaussian count is fixed
              (no adaptive densification, where the paper grows from ~100k into the millions) and
              color is plain RGB rather than spherical harmonics.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* -------------------------- Multi-view diffusion ----------------------- */}

      <PaperSection title="Multi-view diffusion">
        <Prose>
          <p>
            Zero123++ v1.2, pretrained, inference only — the one component not written from scratch.
            One image in, six views at fixed known poses out, in about 24 seconds at 75 steps and 5
            GB of VRAM.
          </p>
        </Prose>

        <FigureRow
          cols={2}
          maxWidth={640}
          items={[
            {
              src: img("multiview_diffusion/outputs/input_lego.png"),
              alt: "Single input image of the lego scene",
              label: "input",
            },
            {
              src: img("multiview_diffusion/outputs/views_grid.png"),
              alt: "Six generated views of the lego scene in a grid",
              label: "6 generated views",
            },
          ]}
        />
      </PaperSection>

      {/* --------------------------- Reconstruction ---------------------------- */}

      <PaperSection title="The pose bridge">
        <Prose>
          <p>
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-neutral-900">
              pose_bridge.py
            </code>{" "}
            converts each view&apos;s azimuth and elevation into a camera position on a sphere,
            points it at the origin with <span className="font-mono text-[0.95em]">look_at</span>,
            and writes a 4×4 camera-to-world matrix. It also mattes out Zero123++&apos;s flat grey
            background by border-median color distance. Skipping that step gets the grey
            reconstructed as a wall around the object.
          </p>
        </Prose>

        <Figure
          src={img("pipeline/seg_check.png")}
          alt="Segmentation check showing each generated view with its grey background matted to alpha"
          maxWidth={840}
          caption="Background matting, verified per view before the poses are written out."
        />
      </PaperSection>

      {/* ---------------------------- Why it's blurry -------------------------- */}

      <PaperSection id="why-blurry" title="Why the output is blurry">
        <Prose>
          <p>
            The useful comparison is the same reconstructor, same code, on two different datasets.
          </p>
        </Prose>

        <FigureRow
          cols={2}
          maxWidth={620}
          items={[
            {
              src: img("pictures/gs_turntable_frame0.png"),
              alt: "Gaussian splatting reconstruction from 100 real photographs",
              label: (
                <>
                  <strong>100 real photos</strong>
                  <br />
                  ~24–25 dB, holds up from any angle
                </>
              ),
            },
            {
              src: img("pipeline/pipe_frame_0.png"),
              alt: "Gaussian splatting reconstruction from six generated views",
              label: (
                <>
                  <strong>6 generated views</strong>
                  <br />
                  24.5 dB, a smear between training views
                </>
              ),
            },
          ]}
        />

        <Callout label="The finding">
          The PSNRs are nearly identical. The 6-view model fits its training views about as well as
          the 100-view model fits its own, and generalizes to nothing. The metric is therefore not
          measuring what it appears to: <strong>24.5 dB there is training PSNR on the only 6 images
          in existence.</strong>
        </Callout>

        <div className="mt-10">
          <Prose>
            <p>Three things compound:</p>
          </Prose>
        </div>

        <ol className="mx-auto mt-6 max-w-3xl space-y-5 text-[1.05rem] leading-[1.75] text-neutral-700 dark:text-neutral-300">
          {[
            <>
              <strong>Six views is severely underconstrained.</strong> Real 3DGS scenes use 100+.
              Most of the volume is never observed, and nothing in the loss prevents the optimizer
              filling it with whatever minimizes error on those six images.
            </>,
            <>
              <strong>Only two elevations, +30° and −20°.</strong> The cameras form two rings with
              large gaps, so most rendered frames are extrapolation rather than interpolation.
            </>,
            <>
              <strong>Zero123++ views are not perfectly consistent with each other.</strong> They are
              six individually plausible images, not six renders of one object. Where they disagree,
              going semi-transparent and blurry is the optimizer&apos;s cheapest way to satisfy all
              of them at once.
            </>,
          ].map((item, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent-soft)] font-mono text-[13px] font-semibold text-[var(--accent)]">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <Prose>
            <p>
              This run&apos;s own budget caps quality on top of that: 160px, 5000 Gaussians, 4000
              iterations, no densification, no spherical harmonics.
            </p>
          </Prose>
        </div>
      </PaperSection>

      {/* ------------------------------ Future work ---------------------------- */}

      <PaperSection title="Improving the reconstruction">
        <Prose>
          <p></p>
        </Prose>

        <div className="mx-auto mt-8 max-w-3xl divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {[
            {
              title: "More views, at more elevations",
              body: "Six views on two rings is the binding constraint. Either run Zero123++ repeatedly with the input reoriented to get extra elevation rings, or switch to a model that emits more natively (SV3D does 21 frames around a full orbit). Going from 6 to ~20 well-spread views should show up immediately.",
            },
            {
              title: "Score distillation",
              body: "Diffusion is currently used once and discarded. Keeping it in the loop instead means rendering the current 3D model from a random angle, noising it, asking the diffusion model how to improve it, and backpropagating into the Gaussians. That is what DreamFusion and Magic3D do, and it addresses cause 3 directly: the model stops averaging inconsistent views and gets pushed toward something plausible from every angle.",
            },
            {
              title: "Finish the splatting implementation",
              body: "Adaptive densification and pruning is the big one; 5k fixed Gaussians against ~100k adaptive ones is the difference between a blob and crisp geometry. Then spherical-harmonic color, and the D-SSIM term the paper pairs with L1.",
            },
            {
              title: "Train at a real resolution",
              body: "The pipeline reconstruction runs at 160px for 4000 iterations while the generated views are 320px, so half the signal is discarded before training starts. This one costs only time.",
            },
            {
              title: "Sparse-view regularization",
              body: "Monocular depth priors per view, RegNeRF-style smoothness on unobserved angles, opacity and scale penalties to kill floaters. Cheap to add and aimed at cause 1.",
            },
            {
              title: "Calibrate the pose bridge",
              body: "It assumes radius 4.0 and the lego FOV, since Zero123++'s intrinsics are not published anywhere convenient. Relative poses are right so the shape survives, but a wrong FOV shears things slightly, and no amount of optimization fixes an inconsistency baked into the cameras.",
            },
          ].map((item, i) => (
            <div key={item.title} className="flex gap-5 px-6 py-5">
              <span className="mt-1 font-mono text-xs font-semibold tabular-nums text-neutral-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-1.5 text-[0.97rem] leading-[1.7] text-neutral-600 dark:text-neutral-400">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Prose>
            <p>
              Further out, feed-forward reconstruction (LRM, TripoSR) replaces per-scene optimization
              with a single forward pass, and mesh extraction would make the output usable in a game
              engine. Ahead of any of that: there is no held-out evaluation yet, so improvements can
              currently only be judged by eye.
            </p>
          </Prose>
        </div>
      </PaperSection>






      <div className="mt-20 border-t border-[var(--border)] pt-10 text-center">
        <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary group">
          {GithubIcon}
          Read the code on GitHub
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </article>
  );
}
