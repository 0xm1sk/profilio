---
<br />
title: "Java OOP & Foundations"
<br />
date: 2026-09-29
<br />
tags: ["java", "oop", "programming"]
<br />
---

# Java OOP & Foundations

## First Steps: Classes & Objects

Starting with the basic structure of a Java program.

### Example: Initial Class Structure
<br />
The following code demonstrates object instantiation, method calls, and handling command-line arguments.

```java
<br />
class Demarage{
<br />
    private String chaine ;
<br />
    public static void main(String [ ]  args ){
<br />
        Demarage d = new Demarage();
<br />
        d.chaine = "hii java";
<br />
        d.afficher();
<br />
        System.out.println("hellow java");
<br />
        // This line will crash if no arguments are provided
<br />
        System.out.println(args[0]);
<br />
    }
<br />
    public void afficher(){
<br />
        System.out.println(chaine);
<br />
    }
<br />
}
<br />
```

### Key Observations
<br />
- **JVM Memory:** The `new` keyword allocates the object on the **Heap**.
<br />
- **Access Modifiers:** `private` fields can be accessed within the same class.
<br />
- **Command Line Args:** `args[0]` refers to the first argument passed during execution. If empty, it triggers an `ArrayIndexOutOfBoundsException`.
