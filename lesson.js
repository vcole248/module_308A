
class Animal {
  constructor(eyes, legs, isAwake, isMoving) {
    this.eyes = eyes;
    this.legs = legs;
    this.isAwake = isAwake;
    this.isMoving = isMoving;
  }
  sleep() { this.isAwake = false; }
  wake() { this.isAwake = true; }
  sit() { this.isMoving = false; }
  walk() { this.isMoving = true; }
  speak(sound) { console.log(sound); }
  toString(animal = 'Animal') {
    return `This ${animal} has ${this.eyes} eyes and ${this.legs} legs. It ${this.isAwake ? 'is' : 'is not'} awake, and ${this.isMoving ? 'is' : 'is not'} moving.`;
  }
}

class Cat extends Animal {
  constructor(fur, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.fur = fur;
  }
  speak() { super.speak("Meow..."); }
  toString() { return super.toString("Cat"); }
}

class Dog extends Animal {
  constructor(fur, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.fur = fur;
  }
  speak() { super.speak("Woof!"); }
  toString() { return super.toString("Dog"); }
}

class Cow extends Animal {
  constructor(hair, isAwake, isMoving) {
    super(2, 4, isAwake, isMoving);
    this.hair = hair;
  }
  speak() { super.speak("Moo."); }
  toString() { return super.toString("Cow"); }
}

class Human extends Animal {
  constructor(name, isAwake, isMoving) {
    super(2, 2, isAwake, isMoving);
    this.name = name;
  }
  introduce() { super.speak(`Hello my name is ${this.name}!`); }
  toString() { return super.toString("Human"); }
}   

const willy = new Human("Willy", true, false);
willy.introduce();
console.log(willy.toString());