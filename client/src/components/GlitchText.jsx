import { motion } from "framer-motion";

const GlitchText = ({ text, className }) => {
  return (
    <motion.span
      className={`glitch-text ${className}`}
      animate={{
        x: [0, -2, 2, -1, 1, 0],
        skewX: [0, -5, 5, -3, 3, 0],
        opacity: [1, 0.9, 1],
      }}
      transition={{
        duration: 0.25,
        repeat: Infinity,
        repeatType: "mirror",
      }}
      data-text={text}
    >
      {text}
    </motion.span>
  );
};

export default GlitchText;
