/* Interview Cake Weekly Problem #370: MeshMessage

You wrote a trendy new messaging app, MeshMessage, to get around flaky cell phone coverage.

Instead of routing texts through cell towers, your app sends messages via the phones of nearby users, 
passing each message along from one phone to the next until it reaches the intended recipient.
(Don't worry—the messages are encrypted while they're in transit.)

Some friends have been using your service, and they're complaining that it takes a long time
for messages to get delivered. After some preliminary debugging, you suspect messages might
not be taking the most direct route from the sender to the recipient.

Given information about active users on the network, find the shortest route for a message
from one user (the sender) to another (the recipient). Return an array of users that make up this route.

*/


const assert = require('assert').strict;


// A Graph represented by an adjacency list.
const network = {
  'Min'     : ['William', 'Jayden', 'Omar'],
  'William' : ['Min', 'Noam'],
  'Jayden'  : ['Min', 'Amelia', 'Ren', 'Noam'],
  'Ren'     : ['Jayden', 'Omar'],
  'Amelia'  : ['Jayden', 'Adam', 'Miguel'],
  'Adam'    : ['Amelia', 'Miguel'],
  'Miguel'  : ['Amelia', 'Adam', 'Nathan'],
  'Noam'    : ['Nathan', 'Jayden', 'William'],
  'Omar': ['Ren', 'Min'],
  'Nathan': ['Miguel', 'Noam'],
};

// Use breadth-first search to find the shortest path
function shortestRoute (graph, startVertice, endVertice) {
  const queue = new Queue();

  queue.enqueue(startVertice);

  // keep track of visited vertices to avoid an infinity loop if there is a circular inside the Graph
  const visitedVertices = new Set([startVertice]);
  const previousVertices = {};
  previousVertices[startVertice] = null;

  while (queue.length > 0) {
    const currentVertice = queue.dequeue();

    if (currentVertice === endVertice) return reconstructPath(previousVertices, endVertice);

    graph[currentVertice].forEach((adjacencyVertice) => {
      if (!visitedVertices.has(adjacencyVertice)) {
        queue.enqueue(adjacencyVertice);
        visitedVertices.add(adjacencyVertice);
        previousVertices[adjacencyVertice] = currentVertice;
      }
    })
  }

  return null;
}

function reconstructPath (previousVertices, endVertice) {
  const path = [];
  let currentVertice = endVertice;
  while (currentVertice !== null) {
    path.unshift(currentVertice);
    currentVertice = previousVertices[currentVertice];
  }
  return path;
}

class Queue {
  constructor() {
    this.storage = {};
    this.start = 0;
    this.end = 0;
    this.length = 0;
  }

  enqueue (value) {
    this.storage[this.end] = value;
    this.end++;
    this.length++;
    return true;
  }

  dequeue () {
    if (this.length) {
      const res = this.storage[this.start];
      delete this.storage[this.start];
      this.start++;
      this.length--;
      return res;
    } else {
      return null;
    }
  }
}

assert.deepStrictEqual(shortestRoute(network, 'Jayden', 'Adam'), ['Jayden', 'Amelia', 'Adam']);
assert.deepStrictEqual(shortestRoute(network, 'William', 'Miguel'), ['William', 'Noam', 'Nathan', 'Miguel']);
console.log("It's working!");
