// src/components/animations/variants.ts

export const fadeInUp = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 1, 1]
      }
    }
  };
  
  export const cardHover = {
    rest: {
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  
  export const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  export const slideIn = {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      x: 20, 
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  export const notificationPanel = {
    initial: { 
      x: "100%",
      opacity: 0,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
    },
    animate: { 
      x: 0,
      opacity: 1,
      boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.2)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      x: "100%",
      opacity: 0,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };
  
  export const tableRowVariant = {
    initial: { 
      opacity: 0, 
      x: -20,
      backgroundColor: "rgba(40, 40, 40, 0)"
    },
    animate: { 
      opacity: 1, 
      x: 0,
      backgroundColor: "rgba(40, 40, 40, 0)",
      transition: {
        duration: 0.3
      }
    },
    hover: {
      backgroundColor: "rgba(40, 40, 40, 0.5)",
      transition: {
        duration: 0.2
      }
    }
  };
  
  export const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: "easeInOut"
      }
    }
  };
  
  export const menuItemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      x: 5,
      transition: {
        duration: 0.2
      }
    }
  };