export default `
void main() {
  数据类型
  int n = 1;
  float n = 1.0;
  bool n = true;

  变量名
  gl_* 内置参数，不可以使用
  int [a-z|A-Z|0-9|_] = 1;

  类型转换
  int a = 1;
  float b = float(a);

  计算 +-*/ ++ -- += -= *= /=

  数据类型（复杂）
  向量 vector vec2/vec3/vec4
  vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
  color.x color.y color.z color.w
  color.r color.g color.b color.a
  color.s color.t color.q color.p
  矩阵 Matrix mat2/mat3/mat4
  需要转置
  mat4 translateMatrix = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.5, 0.0, 0.0, 1.0
  )
  循环
  for(int i=0; i<10; i+=1) {
    //! TODO
  }
  条件
  if(x > 0.5) {
    //! TODO
  }
  函数
  有内置函数 max min 等 详情看文档？
  int sum(int x, int y){
    return x + y;
  }
}
`