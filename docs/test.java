class MaxQueue{
    LinkedList<Integer> queue, maxQ;
    public MaxQueue() {
        queue = new LinkedList<Integer>();
        maxQ = new LinkedList<Integer>();
    }
    
    public int max_value() {
        if(maxQ==null||maxQ.size()==0)return -1;
        return maxQ.getFirst();
    }
    
    public void push_back(int value) {
        if(maxQ.size()==0){
            maxQ.addLast(value);
        }else if(maxQ.getLast()<value){
            for(int i = maxQ.size()-1;i>=0;i--){
                if(maxQ.get(i)<value){
                    maxQ.removeLast();
                }else{
                    break;
                }
            }
            maxQ.addLast(value);
        }else{
            maxQ.addLast(value);
        }
        queue.addLast(value);
    }
    
    public int pop_front() {
        if(queue.size()==0){
            return -1;
        }
        if(queue.getFirst()==maxQ.getFirst()){
            maxQ.removeFirst();
            return queue.removeFirst();
        }
        return queue.removeFirst();
    }
}