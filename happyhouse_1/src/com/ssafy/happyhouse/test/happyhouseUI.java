package com.ssafy.happyhouse.test;

import java.awt.BorderLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.IOException;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import org.xml.sax.SAXException;

import com.ssafy.happyhouse.model.dto.HouseDeal;
import com.ssafy.happyhouse.util.APTDealSAXHandler;

/**
 * @since 2021. 7. 11.
 */
public class happyhouseUI extends JFrame {
    JButton button = null;
    JTable table = null;
    // table의 데이터를 관리하는 객체
    DefaultTableModel model = null;

    public static void main(String[] args) {
    	happyhouseUI ui = new happyhouseUI();
        ui.launchUi();
    }

    private void launchUi() {
        button = new JButton("읽기");
        
        // 테이블 구성
        table = new JTable();
        String[] header = {"번호", "동", "아파트이름", "거래가격","거래종류"};
        model = (DefaultTableModel) table.getModel();
        model.setColumnIdentifiers(header);

        // 이벤트 listener 등록 처리
        addEventListener();
        
        // 요소 배치
        this.add(new JScrollPane(table), BorderLayout.CENTER);
        this.add(button, BorderLayout.SOUTH);
        
        this.setTitle("아파트 거래");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize(500, 300);
        this.setVisible(true);
    }

    private void addEventListener() {
        // TODO: button에서 발생하는 click event 처리를 위한 listener 등록
        button.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // 기존 자료 삭제
                model.setRowCount(0);

                String aptDealFilePath = "res/AptDealHistory.xml";
        		//파서 구현체 Xerces -> IBM -> com sum 헌사 
        		SAXParserFactory factory = SAXParserFactory.newInstance();
        		try {
        			SAXParser parser = factory.newSAXParser();
        			
        			APTDealSAXHandler  aptDealHandler = new APTDealSAXHandler();
        			parser.parse(aptDealFilePath, aptDealHandler);
        			List<HouseDeal> aptDeals = aptDealHandler.getHouses();
        			for (HouseDeal info : aptDeals) {
                        model.addRow(new Object[] {info.getNo(), info.getDong(), 
                        		info.getAptName(), info.getDealAmount()});
                    }
        		} catch (ParserConfigurationException e1) {
        			System.out.println("환경확인: "+e1);
        		} catch (SAXException e1) {
        			System.out.println("파서 중 에러: "+e1);
        		} catch (IOException e1) {
        			System.out.println(aptDealFilePath+" 읽기중 에러: "+e1);
        		}
                
                // model의 데이터가 변경되었음을 알림
                model.fireTableDataChanged();
            }
        });
        // END:
        
        // TODO:테이블에서 발생하는 click event 처리를 위한 listener 등록
        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                int row = table.getSelectedRow();
                String nm = model.getValueAt(row, 1).toString();
                JOptionPane.showMessageDialog(happyhouseUI.this, "선택된 요소: " + nm);
            }
        });
        // END:
    }

}