import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

const InViewAnimation = (props) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1.3, delay: props.delay ?? 0 }}>
      {props.children}
    </motion.div>
  );
};

export default InViewAnimation;
