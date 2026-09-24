/**
 * Autonomous Cinematographic Prompt Optimizer for Livepeer Diffusion Inference
 * Calibrates natural language drafts with professional camera, optics, lighting, and film stock specifications.
 */

export type DirectorialStyle = "cinematic_prime" | "macro_texture" | "dynamic_drone" | "studio_push";

export interface OptimizationResult {
  optimizedPrompt: string;
  cameraSpecs: {
    lens: string;
    motion: string;
    lighting: string;
    filmStock: string;
    framing: string;
  };
}

const STYLE_PROFILES: Record<DirectorialStyle, {
  lens: string;
  motion: string;
  lighting: string;
  filmStock: string;
  composition: string;
}> = {
  cinematic_prime: {
    lens: "35mm anamorphic prime lens T1.5",
    motion: "subtle cinematic dolly drift with fluid horizon stability",
    lighting: "volumetric directional key lighting, warm tungsten rim, atmospheric haze",
    filmStock: "Kodak Vision3 500T color science, delicate 35mm grain, Arri Alexa Mini LF sensor",
    composition: "hyper-realistic, shallow depth of field, natural bokeh",
  },
  macro_texture: {
    lens: "100mm master macro lens F2.8 with 1:1 reproduction ratio",
    motion: "slow tactile rack focus traversing micro-textures",
    lighting: "high-contrast fiber-optic spotlighting, luminous edge glow",
    filmStock: "ultra-high resolution 8K sensor, crisp sub-millimeter specular highlights",
    composition: "extreme close-up macro framing, deep optical isolation",
  },
  dynamic_drone: {
    lens: "24mm ultra-wide cine prime",
    motion: "sweeping high-altitude 3-axis gimbal flyover, kinetic forward momentum",
    lighting: "dramatic golden hour rim lighting, soft low-angle atmospheric rays",
    filmStock: "wide dynamic range cinema profile, rich shadow gradient",
    composition: "expansive architectural vista, commanding scale perspective",
  },
  studio_push: {
    lens: "50mm high-speed cinema prime",
    motion: "tension-building slow linear push-in on optical axis",
    lighting: "three-point studio lighting, diffused key softbox, crisp hair light",
    filmStock: "clean photochemical emulsion look, organic color density",
    composition: "centered vertical subject isolation, graphic leading lines",
  },
};

/**
 * Enriches a basic prompt with authentic cinematographic camera and lighting syntax.
 */
export function optimizeCinematicPrompt(
  rawPrompt: string,
  style: DirectorialStyle = "cinematic_prime",
  aspectRatio: "9:16" | "16:9" | "2.39:1" = "9:16"
): OptimizationResult {
  const cleanRaw = rawPrompt.trim().replace(/^cinematic\s+/i, "");
  const profile = STYLE_PROFILES[style] || STYLE_PROFILES.cinematic_prime;

  const aspectHint =
    aspectRatio === "9:16"
      ? "vertical 9:16 social reel composition with vertical rule of thirds"
      : aspectRatio === "2.39:1"
      ? "ultrawide 2.39:1 anamorphic cinema framing with lateral negative space"
      : "16:9 cinematic widescreen composition";

  const optimizedPrompt = `${cleanRaw}, filmed on ${profile.lens}, ${profile.motion}, ${profile.lighting}, ${profile.filmStock}, ${profile.composition}, ${aspectHint}`;

  return {
    optimizedPrompt,
    cameraSpecs: {
      lens: profile.lens,
      motion: profile.motion,
      lighting: profile.lighting,
      filmStock: profile.filmStock,
      framing: aspectHint,
    },
  };
}
