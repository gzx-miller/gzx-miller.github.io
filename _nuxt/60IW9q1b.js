const n=`#include <iostream>
#include <string>

int main() {
    std::string s1 = "Hello";
    std::string s2 = "World";
    std::string s3 = s1 + ", " + s2 + "!";
    std::cout << s3 << std::endl;

    int arr[5] = {1, 2, 3};
    std::cout << arr[0] << std::endl;

    return 0;
}`;export{n as default};
