---
title: "Java OOP & Foundations"
date: 2026-09-29
tags: ["java", "oop", "programming"]
---

# Java OOP & Foundations

## First Steps: Classes & Objects

Starting with the basic structure of a Java program.

### Example: Initial Class Structure
The following code demonstrates object instantiation, method calls, and handling command-line arguments.

```java
class Demarage{
    private String chaine ;
    public static void main(String [ ]  args ){
        Demarage d = new Demarage();
        d.chaine = "hii java";
        d.afficher();
        System.out.println("hellow java");
        // This line will crash if no arguments are provided
        System.out.println(args[0]);
    }
    public void afficher(){
        System.out.println(chaine);
    }
}
```

### Key Observations
- **JVM Memory:** The `new` keyword allocates the object on the **Heap**.
- **Access Modifiers:** `private` fields can be accessed within the same class.
- **Command Line Args:** `args[0]` refers to the first argument passed during execution. If empty, it triggers an `ArrayIndexOutOfBoundsException`.
