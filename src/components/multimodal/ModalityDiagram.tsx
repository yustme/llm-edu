import { motion } from "framer-motion";

const STAGGER_DELAY = 0.3;
const ANIMATION_DURATION = 0.5;

interface ModalityNode {
  id: string;
  label: string;
  iconLabel: string;
  fill: string;
  stroke: string;
  textColor: string;
  /** Position: cx, cy for the center of the node */
  cx: number;
  cy: number;
}

const MODALITY_NODES: ModalityNode[] = [
  {
    id: "text",
    label: "Text",
    iconLabel: "Aa",
    fill: "#DBEAFE",
    stroke: "#93C5FD",
    textColor: "#1D4ED8",
    cx: 120,
    cy: 60,
  },
  {
    id: "image",
    label: "Image",
    iconLabel: "IMG",
    fill: "#D1FAE5",
    stroke: "#6EE7B7",
    textColor: "#047857",
    cx: 380,
    cy: 60,
  },
  {
    id: "audio",
    label: "Audio",
    iconLabel: "WAV",
    fill: "#FEF3C7",
    stroke: "#FCD34D",
    textColor: "#B45309",
    cx: 120,
    cy: 200,
  },
  {
    id: "video",
    label: "Video",
    iconLabel: "MP4",
    fill: "#EDE9FE",
    stroke: "#C4B5FD",
    textColor: "#6D28D9",
    cx: 380,
    cy: 200,
  },
];

const CENTER_X = 250;
const CENTER_Y = 130;
const OUTPUT_Y = 280;

export function ModalityDiagram() {
  return (
    <svg
      viewBox="0 0 500 340"
      className="w-full max-w-xl mx-auto"
      role="img"
      aria-label="Multimodal convergence diagram showing four input modalities converging into a central model"
    >
      {/* Arrows from each modality to center */}
      {MODALITY_NODES.map((node, index) => (
        <motion.line
          key={`arrow-${node.id}`}
          x1={node.cx}
          y1={node.cy}
          x2={CENTER_X}
          y2={CENTER_Y}
          stroke={node.stroke}
          strokeWidth={2}
          strokeDasharray="6 3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{
            delay: index * STAGGER_DELAY + 0.2,
            duration: ANIMATION_DURATION,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Arrow from center to output */}
      <motion.line
        x1={CENTER_X}
        y1={CENTER_Y + 30}
        x2={CENTER_X}
        y2={OUTPUT_Y - 20}
        stroke="#94A3B8"
        strokeWidth={2}
        strokeDasharray="6 3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.7 }}
        transition={{
          delay: MODALITY_NODES.length * STAGGER_DELAY + 0.5,
          duration: ANIMATION_DURATION,
          ease: "easeOut",
        }}
      />

      {/* Input modality nodes */}
      {MODALITY_NODES.map((node, index) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: index * STAGGER_DELAY,
            duration: ANIMATION_DURATION,
            ease: "easeOut",
          }}
        >
          <rect
            x={node.cx - 40}
            y={node.cy - 25}
            width={80}
            height={50}
            rx={10}
            fill={node.fill}
            stroke={node.stroke}
            strokeWidth={2}
          />
          <text
            x={node.cx}
            y={node.cy - 5}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            fontFamily="monospace"
            fill={node.textColor}
          >
            {node.iconLabel}
          </text>
          <text
            x={node.cx}
            y={node.cy + 12}
            textAnchor="middle"
            fontSize={11}
            fontWeight={500}
            fill={node.textColor}
          >
            {node.label}
          </text>
        </motion.g>
      ))}

      {/* Center model circle */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: MODALITY_NODES.length * STAGGER_DELAY + 0.1,
          duration: ANIMATION_DURATION,
          ease: "easeOut",
        }}
      >
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={32}
          fill="#F1F5F9"
          stroke="#64748B"
          strokeWidth={2}
        />
        <text
          x={CENTER_X}
          y={CENTER_Y - 4}
          textAnchor="middle"
          fontSize={10}
          fontWeight={700}
          fill="#334155"
        >
          Multimodal
        </text>
        <text
          x={CENTER_X}
          y={CENTER_Y + 10}
          textAnchor="middle"
          fontSize={10}
          fontWeight={500}
          fill="#334155"
        >
          Model
        </text>
      </motion.g>

      {/* Output node */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: MODALITY_NODES.length * STAGGER_DELAY + 0.8,
          duration: ANIMATION_DURATION,
          ease: "easeOut",
        }}
      >
        <rect
          x={CENTER_X - 55}
          y={OUTPUT_Y - 18}
          width={110}
          height={36}
          rx={8}
          fill="#F0FDF4"
          stroke="#86EFAC"
          strokeWidth={2}
        />
        <text
          x={CENTER_X}
          y={OUTPUT_Y + 5}
          textAnchor="middle"
          fontSize={12}
          fontWeight={600}
          fill="#166534"
        >
          Understanding
        </text>
      </motion.g>
    </svg>
  );
}
