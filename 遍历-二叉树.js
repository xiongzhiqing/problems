// 递归和栈有着脱不开的干系。

// 通过合理的安排入栈和出栈的时机、使栈的出栈顺序复合二叉树的前序遍历规则。

/**
 * 先序遍历迭代实现：
 *
 * 出入栈顺序：
 * 1、将根结点入栈；
 * 2、取出栈顶结点，将结点值 push 进结果数组；
 * 3、若栈顶结点有右孩子，则将右孩子入栈；
 * 4、若栈顶结点有子孩子，则将左孩子入栈；
 *
 * 重复 2、3、4步骤，直至栈空，就能得到一个先序遍历序列。
 *
 *
*/
const root = {
  val: 1,
  left: {
    val: 4,
  },
  right: {
    val: 2,
    left: {
      val: 3
    },
    right: {
      val: 5
    }
  }
}
const preorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 处理边界条件
  if (!root) return res

  // 初始化栈结构
  const stack = []

  // 首先将根结点入栈
  stack.push(root)

  // 若栈顶不为空，则重复出栈、入栈操作
  while (stack.length) {
    // 将栈顶结点记为当前结点
    const cur = stack.pop()
    // 当前结点就是当前子树的根结点，把这个结点放在结果数组的尾部
    res.push(cur.val)
    // 若当前子树根结点有右孩子，则将右孩子入栈
    if (cur.right) {
      stack.push(cur.right)
    }

    // 若当前子树根结点有左孩子，则将左孩子入栈
    if (cur.left) {
      stack.push(cur.left)
    }
  }

  // 返回结果数组
  return res
}
console.log(preorderTraversal(root))

/**
 * 异曲同工的后续遍历迭代实现：
 *
 * 后续遍历的出栈序列，按照规则应该是 左 -> 右 -> 根。这个顺序相对于先序遍历，最明显的变化就是根节点的位置从第一个变成了倒数第一个。
 *
 * 与其从stack这个栈结构上入手，不如从 res 结果数组上入手：可以直接把pop出来的当前节点 unshift 进 res 的头部。
 *
 *
 *
*/

const postorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 处理边界条件
  if (!root) return res

  // 初始化栈结构
  const stack = []

  // 首先将根结点入栈
  stack.push(root)

  // 若栈顶不为空，则重复出栈、入栈操作
  while (stack.length) {
    // 将栈顶结点记为当前结点
    const cur = stack.pop()
    // 当前结点就是当前子树的根结点，把这个结点放在结果数组的头部
    res.unshift(cur.val)

    // 若当前子树根结点有左孩子，则将左孩子入栈
    if (cur.left) {
      stack.push(cur.left)
    }
    // 若当前子树根结点有右孩子，则将右孩子入栈
    if (cur.right) {
      stack.push(cur.right)
    }
  }

  // 返回结果数组
  return res
}

console.log(postorderTraversal(root))


/**
 * 思路清奇的中序遍历迭代实现：
 *
 * 中序遍历的序列规则是： 左 -> 中 -> 右
 * 必须首先定位到最左的叶子结点。在这个定位的过程中，必然会途径目标结点的父节点、爷爷结点和各种辈分的祖宗结点：
 * 途径的每一个结点，都要及时入栈。这样当最左的叶子结点出栈时，第一个回溯到的就是它的父节点。
 *
 *
 * 1、两个 while ： 内层while的作用是在寻找最左叶子结点的过程，把途径的所有结点都记录到 stack 栈里。记录工作完成后，才会走到外出 while 的剩余逻辑里 ---- 这部分逻辑的作用是从最左的叶子结点开始，一层层回溯遍历左孩子的父节点和右侧兄弟结点，进而完成整个中序遍历任务。
 * 2、外层while的两个条件： cur 的存在性和stack.length 的存在性，各自是为了限制什么❓
 *    1、stack.length 的存在比较好理解， stack中存储的是没有被推入结果数组 res 的待遍历元素。只有 stack 不为空，就意味着遍历没有结束，遍历动作需要继续重复。
 *    2、cur 的存在性就比较有趣了，它对应一下集中情况：
 *       1、初始态，cur 指向 root 结点，只要root 不为空， cur 就不为空。此时判断了 cur 存在后， 就会开始最左叶子结点的寻找之旅。这趟“一路向左”的旅途中，cur 始终指向当前比那里到的左孩子。
 *       2、第一波内层 while 循环结束， cur 开始承担中序遍历的游标职责。 cur 始终会指向当前栈的栈顶元素，也就是“一路向左”过程中的某个左孩子，然后将这个左孩子作为中序遍历的第一个结果元素纳入结果数组。假如这个左孩子是一个叶子结点，那么尝试取其右孩子时就只能取到 null，这个 null 的存在，会导致内存循环 while 被跳过，接着就直接回溯到了这个左孩子的父节点，符合 左 -> 根的序列规则。
 *       3、假如当前取到的栈顶元素不是叶子结点，同时有一个右孩子，那么阐释取其右孩子时就回取到一个存在的结点。 cur 存在，于是进入内层 while 循环，重复“一路向左”的操作，去寻找这个右孩子对应的子树里最靠左的结点，然后去重复刚刚这个或回溯、或“一路向左”的过程。如果这个右孩子对应的子树里面没有左孩子，那么跳出内层 while 循环后，紧接着被纳入 res 结果数组的就是这个右孩子本身，符合 根 -> 右 的序列规则。
 *
*/

const inorderTraversal = function (root) {
  // 定义结果数组
  const res = []
  // 初始化栈结构
  const stack = []

  // 用一个cur结点充当游标
  let cur = root

  // 当 cur 不为空， 或者 stack 不为空时，重复以下逻辑
  while (cur || stack.length) {
    // 这个 while 的作用是把寻找最左叶子结点的过程中，途径的所有节点都记录下来
    while (cur) {
      // 将途径的结点入栈
      stack.push(cur)
      // 继续搜索当前节点的左孩子
      cur = cur.left
    }

    // 取出栈顶元素 （左孩子叶子结点）
    cur = stack.pop()
    // 将栈顶元素这个结点放在结果数组中
    res.push(cur.val)
    // 尝试读取 cur 结点的右孩子
    cur = cur.right
  }
  // 返回结果数组
  return res
}

console.log(inorderTraversal(root))


// ***** 层序遍历的衍生问题


/**
 * 题目1：
 * 给你一个二叉树，请你返回按 层序遍历 得到的节点值。（即逐层地，从左到右访问所有节点）。
 *
 * 实例：二叉树： [3,9,20,null, null, 15, 7]
 *   3
    / \
    9  20
      /  \
    15   7
 *
 * 返回层次遍历结果：[
 *  [3],
 *  [9,20],
 *  [15,7],
 * ]
 *
 * 解法（思路分析）：
 * 层序遍历 -> 条件反射出  BFS + 队列  这对好基友。
 * 所谓变体，不过是在 BFS（深度搜索优先） 的过程中围绕结果数组的内容做文章。
 * 此题要求我们对层序遍历结果进行分层。也就是说只要我们能在 BFS 的过程中 感知到当前层级、同时用不同的数组把不同的层级区分开， 这题就得解了。
 *
 * 在对二叉树进行层级遍历时，每一次 while 循环其实都对应着二叉树的某一层。只要我们在进入 while循环之处，记录下这一层几点个数，然后将这个数量范围内的元素push进同一个数组，就能够实现二叉树分层。
 *
 *
*/
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
const levelOrder = function (root) {
  // 初始化结果数组
  const res = []
  // 处理编辑条件
  if (!root) return res
  // 初始化队列
  const queue = []
  // 队列第一个元素是根结点
  queue.push(root)
  // 当队列不为空时， 反复执行以下逻辑
  while (queue.length) {
    // level 用来存储当前层的节点
    const level = []
    // 缓存刚进入循环时的队列长度，这一步很关键，因为队列长度后面会发生变化
    const len = queue.length
    // 循环遍历当前层级的结点
    for (let i = 0; i < len; i++) {
      // 取出队里的头部元素
      const top = queue.shift()
      // 将头部元素的值推入 level 数组
      level.push(top.val)
      // 若果当前结点有左孩子，则退入下一层级
      if (top.left) {
        queue.push(top.left)
      }
      // 如果当前结点有右孩子，则推入下一层级
      if (top.right) {
        queue.push(top.right)
      }
    }
    // 将 level 推入结果数组
    res.push(level)
  }
  // 返回结果数组
  return res
}


const root1 = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: {
        val: 8
      },
      right: {
        val: 9
      }

    },
    right: {
      val: 5,
      left: {
        val: 10
      },
      right: {
        val: 11
      }
    }
  },
  right: {
    val: 3,
    left: {
      val: 6,
      left: {
        val: 12
      },
      right: {
        val: 13
      }
    },
    right: {
      val: 7,
      left: {
        val: 14,
      },
      right: {
        val: 15
      }
    }
  }
}
console.log(levelOrder(root1))


// ***** 翻转二叉树


/**
 * 题目2：
 * 翻转一颗二叉树。
 *
 * 示例：
 * 输入：
 *
 *      4
      /   \
     2     7
    / \   / \
   1   3 6   9
 *
 * 输出：
 *      4
      /   \
     7     2
    / \   / \
   9   6 3   1
 *
 * 解法（思路分析）：这是一道非常经典的递归应用题。
 *  一颗二叉树，经过翻转后会有什么特点？答案是每一棵树的左孩子和右孩子都发生了交换。既然是“每一棵子树”，那么意味着重复，既然涉及了重复，就没有理由不用递归。
 *
 * 以递归的方式，遍历树中的每一个结点，并将每一个结点的左右孩子进行交换。
 *
*/

const invertTree = function (root) {
  // 定义递归边界
  if (!root) return root
  // 递归交换右孩子的子结点
  let right = invertTree(root.right)
  // 递归交换左孩子的子结点
  let left = invertTree(root.left)
  // 交换当前遍历到的两个左右孩子结点
  root.left = right
  root.right = left
  return root
}

console.log(invertTree(root1))